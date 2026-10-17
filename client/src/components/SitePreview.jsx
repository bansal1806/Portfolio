import { useEffect, useRef, useState } from 'react';
import { checkEmbeddable } from '../api.js';

const DESKTOP = { width: 1440, height: 900 }; // live sites render at desktop size, then scale down

/**
 * A mini browser window showing a project's live site.
 * - `scroll="hover"`: full-page screenshot that scrolls top → bottom while hovered (cards).
 * - `scroll="manual"`: the screenshot scrolls inside the frame like a real page (detail page).
 * - `live`: renders the real, interactive site in an iframe (detail page).
 * - `liveCard`: the real site running inside the card, scaled down and display-only. The API
 *   first checks the site allows being framed here; until then (or if not) the screenshot shows.
 */
export default function SitePreview({ url, image, title, scroll = 'hover', live = false, liveCard = false, className = '' }) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const [canFrame, setCanFrame] = useState(false);

  useEffect(() => {
    if (!liveCard) return undefined;
    let active = true;
    checkEmbeddable(url).then((ok) => active && setCanFrame(ok));
    return () => {
      active = false;
    };
  }, [liveCard, url]);

  const showLive = liveCard && canFrame;

  return (
    <div className={`site-preview ${className}`}>
      <div className="site-bar" aria-hidden="true">
        <span className="site-dots"><i /><i /><i /></span>
        <span className="site-url">{host}</span>
        {showLive && <span className="site-live">Live</span>}
      </div>
      <div className={`site-view scroll-${live ? 'live' : liveCard ? 'live-card' : scroll}`}>
        {live ? (
          <iframe src={url} title={`${title} — live site`} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <img src={image} alt={`Screenshot of the ${title} website`} loading="lazy" decoding="async" />
        )}
        {showLive && <ScaledFrame url={url} title={title} />}
      </div>
    </div>
  );
}

/** Desktop-sized iframe scaled to the width of its container. */
function ScaledFrame({ url, title }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / DESKTOP.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <iframe
      ref={ref}
      src={url}
      title={`${title} — live preview`}
      loading="lazy"
      referrerPolicy="no-referrer"
      tabIndex={-1}
      aria-hidden="true"
      className={`scaled-frame${loaded ? ' loaded' : ''}`}
      width={DESKTOP.width}
      height={DESKTOP.height}
      style={{ transform: `scale(${scale})` }}
      onLoad={() => setLoaded(true)}
    />
  );
}
