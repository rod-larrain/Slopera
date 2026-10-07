import { ReplitConnectors } from "@replit/connectors-sdk";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  JoinSloperaWaitlistBody,
  JoinSloperaWaitlistResponse,
  SubmitSloperaTragedyBody,
  SubmitSloperaTragedyResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 8;
const MAX_TRACKED_IPS = 10_000;

interface RateLimitEntry {
  attempts: number;
  expiresAt: number;
}

const attemptsByIp = new Map<string, RateLimitEntry>();

function allowAttempt(req: Request, res: Response, errorMessage: string): boolean {
  const now = Date.now();

  for (const [ip, entry] of attemptsByIp) {
    if (entry.expiresAt <= now) {
      attemptsByIp.delete(ip);
    }
  }

  const ip = req.ip ?? "unknown";
  const entry = attemptsByIp.get(ip);

  if (!entry) {
    if (attemptsByIp.size >= MAX_TRACKED_IPS) {
      res.status(429).json({ error: errorMessage });
      return false;
    }
    attemptsByIp.set(ip, { attempts: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
    res.status(429).json({ error: errorMessage });
    return false;
  }

  entry.attempts += 1;
  return true;
}

function trimInputStrings(body: unknown): unknown {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );
}

interface EmailMessage {
  requestId: string;
  subject: string;
  text: string;
  replyTo?: string;
}

async function deliverEmail(req: Request, email: EmailMessage): Promise<boolean> {
  try {
    const response = await new ReplitConnectors().proxy("resend", "/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": `slopera-${email.requestId}`,
      },
      body: JSON.stringify({
        from: "Slopera House <leo@slopera.nyc>",
        to: ["leo@slopera.nyc"],
        subject: email.subject,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      req.log.error("Slopera email provider rejected the request");
      return false;
    }

    const result: unknown = await response.json();
    if (
      result === null ||
      typeof result !== "object" ||
      !("id" in result) ||
      typeof result.id !== "string" ||
      result.id.trim().length === 0
    ) {
      req.log.error("Slopera email provider returned no email id");
      return false;
    }

    return true;
  } catch {
    req.log.error("Slopera email delivery failed");
    return false;
  }
}

const WAITLIST_ERROR = "The Committee could not add you to the list. Please try again.";
const TRAGEDY_ERROR =
  "The Committee could not receive your tragedy. Please try again.";
const RATE_LIMIT_ERROR = "Too many requests. Please try again later.";

const productNames = {
  vinyl: "My iPhone Sucks (Vinyl LP)",
  cd: "Patch My Burrito With Another Tortilla (CD)",
  cassette: "Wherever (Cassette)",
  "box-set": "The Complete Small Tragedies (26 CD Box Set)",
  poster: "I Don't Like Your New Haircut, Live at the Acropolis (Poster)",
  tee: "I Sneezed and I Shook Your Hand Tee",
} as const;

router.post("/slopera/waitlist", async (req, res): Promise<void> => {
  if (!allowAttempt(req, res, RATE_LIMIT_ERROR)) {
    return;
  }

  const parsed = JoinSloperaWaitlistBody.safeParse(trimInputStrings(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid waitlist submission." });
    return;
  }

  if (parsed.data.website) {
    res.status(400).json({ error: "Invalid waitlist submission." });
    return;
  }

  const productName = productNames[parsed.data.productId];
  const delivered = await deliverEmail(req, {
    requestId: parsed.data.requestId,
    replyTo: parsed.data.email,
    subject: "Slopera House waitlist signup",
    text: `Waitlist signup for ${productName}.\nEmail: ${parsed.data.email}`,
  });

  if (!delivered) {
    res.status(503).json({ error: WAITLIST_ERROR });
    return;
  }

  res.status(200).json(
    JoinSloperaWaitlistResponse.parse({
      message: "You're on the list. Leonardo has been informed.",
    }),
  );
});

router.post("/slopera/tragedies", async (req, res): Promise<void> => {
  if (!allowAttempt(req, res, RATE_LIMIT_ERROR)) {
    return;
  }

  const parsed = SubmitSloperaTragedyBody.safeParse(trimInputStrings(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid tragedy submission." });
    return;
  }

  if (parsed.data.website) {
    res.status(400).json({ error: "Invalid tragedy submission." });
    return;
  }

  const delivered = await deliverEmail(req, {
    requestId: parsed.data.requestId,
    ...(parsed.data.email ? { replyTo: parsed.data.email } : {}),
    subject: "A new tragedy for the Slopera House Committee",
    text: [
      "A new tragedy has been submitted.",
      parsed.data.handle ? `Handle: ${parsed.data.handle}` : undefined,
      parsed.data.email ? `Email: ${parsed.data.email}` : undefined,
      "",
      parsed.data.tragedy,
    ]
      .filter((line): line is string => line !== undefined)
      .join("\n"),
  });

  if (!delivered) {
    res.status(503).json({ error: TRAGEDY_ERROR });
    return;
  }

  res.status(200).json(
    SubmitSloperaTragedyResponse.parse({
      message: "Received. The Committee has wept. Decision within the week.",
    }),
  );
});

export default router;