import { useEffect, useRef, useState } from 'react';

type InstagramWindow = Window & {
  instgrm?: { Embeds?: { process: () => void } };
};

const profileUrl = 'https://www.instagram.com/sloperahouse/';
// A verified public post from @sloperahouse. The custom latest-post feed still
// needs its Behold ID; this native embed does not require API credentials.
const postUrl = 'https://www.instagram.com/p/Dd9IGMMB7Wg/';

export function InstagramProfileEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Instagram replaces its blockquote with an iframe. Keep that DOM inside
    // an unmanaged container so React can safely mount and unmount this section.
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', postUrl);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.cssText = 'background:#fff;border:0;margin:0;max-width:540px;min-width:0;width:100%;';
    const link = document.createElement('a');
    link.href = postUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View this post on Instagram ↗';
    blockquote.append(link);
    container.replaceChildren(blockquote);

    const process = () => {
      (window as InstagramWindow).instgrm?.Embeds?.process();
    };
    const onError = () => setFailed(true);
    let script = document.querySelector<HTMLScriptElement>('script[data-slopera-instagram-embed]');
    const newScript = !script;
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.dataset.sloperaInstagramEmbed = 'true';
    }
    script.addEventListener('load', process);
    script.addEventListener('error', onError);
    if (newScript) document.body.append(script);
    process();
    const timeout = window.setTimeout(() => {
      if (!container.querySelector('iframe')) setFailed(true);
    }, 15000);

    return () => {
      window.clearTimeout(timeout);
      script.removeEventListener('load', process);
      script.removeEventListener('error', onError);
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="instagram-profile" data-testid="instagram-profile-embed">
      <div className="instagram-embed-container" ref={containerRef} />
      <p className="instagram-status">
        {failed && 'Instagram could not load in this browser. '}
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">View @sloperahouse on Instagram ↗</a>
      </p>
    </div>
  );
}