/**
 * A mini browser window showing a project's live site.
 * - `scroll="hover"`: full-page screenshot that scrolls top → bottom while hovered (cards).
 * - `scroll="manual"`: the screenshot scrolls inside the frame like a real page (detail page).
 * - `live`: renders the real site in an iframe (only for sites that allow being framed).
 */
export default function SitePreview({ url, image, title, scroll = 'hover', live = false, className = '' }) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className={`site-preview ${className}`}>
      <div className="site-bar" aria-hidden="true">
        <span className="site-dots"><i /><i /><i /></span>
        <span className="site-url">{host}</span>
      </div>
      <div className={`site-view scroll-${live ? 'live' : scroll}`}>
        {live ? (
          <iframe src={url} title={`${title} — live site`} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <img src={image} alt={`Screenshot of the ${title} website`} loading="lazy" decoding="async" />
        )}
      </div>
    </div>
  );
}
