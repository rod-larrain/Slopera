import { useEffect, useState } from 'react';
import { InstagramProfileEmbed } from './InstagramProfileEmbed';

// Public Behold JSON feed connected to @sloperahouse.
// Configure the feed for 8 posts and include reels/videos.
// Behold's free plan supports only 6 posts; 8 requires a suitable plan.
export const BEHOLD_FEED_ID = 'O78DMojfOMoyhpwnNhCQ';

type InstagramPost = {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  sizes?: { medium?: { mediaUrl: string } };
};

const instagramUrl = 'https://www.instagram.com/sloperahouse';
const cleanText = (text: string) => text.replace(/\u2014/g, ',');

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [status, setStatus] = useState('Loading the latest tragedies.');
  const configured = !BEHOLD_FEED_ID.startsWith('YOUR_');

  useEffect(() => {
    if (!configured) return;
    let disposed = false;
    let activeRequest: AbortController | null = null;

    const refresh = async () => {
      if (document.hidden || activeRequest) return;
      const controller = new AbortController();
      activeRequest = controller;
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(`https://feeds.behold.so/${encodeURIComponent(BEHOLD_FEED_ID)}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Feed unavailable');
        const data: unknown = await response.json();
        if (!data || typeof data !== 'object' || !('posts' in data) || !Array.isArray(data.posts)) {
          throw new Error('Invalid feed response');
        }
        const validPosts = data.posts.filter((post): post is InstagramPost => {
          if (!post || typeof post !== 'object') return false;
          if (typeof post.id !== 'string' || typeof post.permalink !== 'string' ||
              typeof post.mediaUrl !== 'string' || typeof post.timestamp !== 'string') return false;
          try {
            const url = new URL(post.permalink);
            return url.protocol === 'https:' && ['www.instagram.com', 'instagram.com'].includes(url.hostname);
          } catch {
            return false;
          }
        }).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 8);
        if (!disposed) {
          setPosts(validPosts);
          setStatus(validPosts.length ? '' : 'No tragedies are available in the feed yet. Follow us on Instagram.');
        }
      } catch {
        if (!disposed) {
          setStatus('The Instagram feed could not load. Watch the latest tragedies on Instagram.');
        }
      } finally {
        window.clearTimeout(timeout);
        if (activeRequest === controller) activeRequest = null;
      }
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), 30 * 60 * 1000);
    const onVisible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true;
      activeRequest?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [configured]);

  const playPreview = (element: HTMLAnchorElement) => {
    const video = element.querySelector('video');
    if (video) void video.play().catch(() => { /* The thumbnail remains available. */ });
  };
  const stopPreview = (element: HTMLAnchorElement) => {
    element.querySelector('video')?.pause();
  };

  if (!configured) return <InstagramProfileEmbed />;

  return (
    <>
      <div className="episode-grid" data-testid="grid-episodes" aria-label="Latest Instagram tragedies">
        {posts.length ? posts.map((post, index) => {
          const image = post.sizes?.medium?.mediaUrl || post.thumbnailUrl || post.mediaUrl;
          const caption = cleanText(post.caption || `Tragedy ${index + 1}`);
          return (
            <article className="episode" key={post.id} data-testid={`card-instagram-${post.id}`}>
              <a className="episode-screen instagram-post" href={post.permalink} target="_blank" rel="noopener noreferrer"
                aria-label={`Watch on Instagram: ${caption.slice(0, 140)}`}
                onMouseEnter={(event) => playPreview(event.currentTarget)}
                onMouseLeave={(event) => stopPreview(event.currentTarget)}
                onFocus={(event) => playPreview(event.currentTarget)}
                onBlur={(event) => stopPreview(event.currentTarget)}>
                {post.mediaType === 'VIDEO'
                  ? <video src={post.mediaUrl} poster={image} muted loop playsInline preload="none" aria-hidden="true" />
                  : <img src={image} alt={cleanText(post.altText || caption)} loading="lazy" />}
                <span className="episode-play"><span className="episode-number">Watch on Instagram ↗</span></span>
              </a>
            </article>
          );
        }) : Array.from({ length: 8 }, (_, index) => (
          <div className="episode" key={index} aria-hidden="true">
            <div className="episode-screen instagram-placeholder" />
          </div>
        ))}
      </div>
      {status && <p className="instagram-status" role="status">{status} <a href={instagramUrl} target="_blank" rel="noopener noreferrer">@sloperahouse ↗</a></p>}
    </>
  );
}