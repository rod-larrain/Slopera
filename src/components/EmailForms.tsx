import { useState, type FormEvent } from 'react';

// Both forms are handled by Netlify Forms. Netlify detects them from the hidden
// copies in index.html (same form-name and field names), stores each submission,
// and emails it to the address set in Netlify: Forms > Form notifications.

type ProductId = 'vinyl' | 'cd' | 'cassette' | 'box-set' | 'poster' | 'tee';

async function sendToNetlify(formName: string, data: FormData) {
  data.set('form-name', formName);
  const body = new URLSearchParams();
  data.forEach((value, key) => body.append(key, String(value)));
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
}

function Honeypot() {
  return (
    <div className="form-honeypot" aria-hidden="true">
      <label>Website<input type="text" name="bot-field" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

export function WaitlistForm({ productId, productName }: { productId: ProductId; productName: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [joined, setJoined] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    data.set('product', productName);
    setPending(true);
    setMessage('');
    try {
      await sendToNetlify('waitlist', data);
      setMessage("You're on the list. Leonardo has been informed.");
      setJoined(true);
    } catch {
      setMessage('We could not add you to the waitlist. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="waitlist-control">
      {!joined && <button type="button" className="wait-button" aria-expanded={open} aria-controls={`waitlist-${productId}`}
        onClick={() => setOpen((value) => !value)} data-testid={`button-waitlist-${productId}`}>
        Join the waitlist <span aria-hidden="true">↗</span>
      </button>}
      {open && !joined && <form id={`waitlist-${productId}`} className="waitlist-form" onSubmit={submit}
        aria-label={`Join the waitlist for ${productName}`} aria-busy={pending} data-testid={`form-waitlist-${productId}`}
        onChange={() => setMessage('')}>
        <label htmlFor={`waitlist-email-${productId}`}>Your email</label>
        <input id={`waitlist-email-${productId}`} name="email" type="email" autoComplete="email"
          placeholder="you@example.com" maxLength={254} required disabled={pending} data-testid={`input-waitlist-email-${productId}`} />
        <Honeypot />
        <button className="wait-button" type="submit" disabled={pending} data-testid={`button-join-${productId}`}>
          {pending ? 'Joining...' : 'Join'} <span aria-hidden="true">↗</span>
        </button>
      </form>}
      {message && <p className="feedback" role="status" aria-live="polite" data-testid={`status-waitlist-${productId}`}>{message}</p>}
    </div>
  );
}

export function TragedyForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!String(data.get('tragedy') || '').trim()) {
      setMessage('Please enter your tragedy.');
      return;
    }
    setPending(true);
    setMessage('');
    try {
      await sendToNetlify('tragedy', data);
      setMessage('Received. The Committee has wept. Decision within the week.');
      form.reset();
    } catch {
      setMessage('Your tragedy could not be sent. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="submission-form reveal reveal-delay-1" onSubmit={submit} aria-busy={pending} data-testid="form-submission"
      onChange={() => setMessage('')}>
      <label htmlFor="tragedy">Your tragedy</label>
      <textarea id="tragedy" name="tragedy" rows={3} placeholder={'My roommate replied "K".'} maxLength={5000} required disabled={pending} data-testid="input-tragedy" />
      <label htmlFor="email">Your email (optional)</label>
      <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} disabled={pending} data-testid="input-submission-email" />
      <Honeypot />
      <button className="button" type="submit" disabled={pending} data-testid="button-submit-tragedy">
        {pending ? 'Sending...' : 'Submit tragedy'} <span aria-hidden="true">↗</span>
      </button>
      {message && <p className="feedback" role="status" aria-live="polite" data-testid="status-submission-feedback">{message}</p>}
    </form>
  );
}
