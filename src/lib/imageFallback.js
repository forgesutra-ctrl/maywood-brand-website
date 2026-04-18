/** Neutral placeholder served from `public/assets/images/fallback.jpg`. */
export const IMAGE_FALLBACK_SRC = '/assets/images/fallback.jpg'

/**
 * Use on `<img onError={handleImgError} />` to avoid broken-image UI if a path 404s.
 */
export function handleImgError(e) {
  const el = e?.currentTarget
  if (!el) return
  const target = IMAGE_FALLBACK_SRC
  try {
    const u = new URL(el.src, window.location.origin)
    if (u.pathname.endsWith('/fallback.jpg')) return
  } catch {
    /* ignore */
  }
  if (el.getAttribute('data-img-fallback') === '1') return
  el.setAttribute('data-img-fallback', '1')
  el.onerror = null
  el.src = target
}
