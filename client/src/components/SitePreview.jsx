import { useEffect, useRef, useState } from 'react';
import { checkEmbeddable } from '../api.js';

const DESKTOP = { width: 1440, height: 900 }; // live sites render at desktop size, then scale down

// Live card iframes load a whole site, so only run them on large screens with a mouse.
const LIVE_CARD_QUERY = '(min-width: 1024px) and (hover: hover)';

/** True once the API confirms `url` allows being framed on this origin. */
export function useEmbeddable(url, enabled = true) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(false);
    if (!enabled) return undefined;
    let active = true;
    checkEmbeddable(url).then((res) => active && setOk(res));
    return () => {
      active = false;
    };
  }, [url, enabled]);

  return ok;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * A mini browser window showing a project's live site.
 * - `scroll="hover"`: full-page screenshot that scrolls top → bottom while hovered (cards).
 * - `scroll="manual"`: the screenshot scrolls inside the frame like a real page (detail page).
 * - `live`: renders the real, interactive site in an iframe. Pass it only once the site is
 *   known to allow framing (see `useEmbeddable`).
 * - `liveCard`: the real site running inside the card, scaled down and display-only. Large
 *   screens only; the screenshot shows until the embed check passes (or if it fails).
 */
export default function SitePreview({ url, image, title, scroll = 'hover', live = false, liveCard = false, className = '' }) {
  // `url` may be missing for projects that aren't deployed yet: show the screenshot only.
  const host = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Preview';
  const bigScreen = useMediaQuery(LIVE_CARD_QUERY);
  const tryLiveCard = Boolean(url) && liveCard && bigScreen;
  const canFrame = useEmbeddable(url, tryLiveCard);
  const showLiveCard = tryLiveCard && canFrame;

  const mode = live ? 'live' : tryLiveCard ? 'live-card' : scroll;

  return (
    <div className={`site-preview ${className}`}>
      <div className="site-bar" aria-hidden="true">
        <span className="site-dots"><i /><i /><i /></span>
        <span className="site-url">{host}</span>
        {(live || showLiveCard) && <span className="site-live">Live</span>}
      </div>
      <div className={`site-view scroll-${mode}`}>
        {live && url ? (
          <iframe src={url} title={`${title} — live site`} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <img src={image} alt={`Screenshot of the ${title} website`} loading="lazy" decoding="async" />
        )}
        {showLiveCard && <ScaledFrame url={url} title={title} />}
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
