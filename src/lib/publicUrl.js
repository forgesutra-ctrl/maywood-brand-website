/**
 * Build URL for static files in /public (served at site root in dev & build).
 * Honors Vite `base` via import.meta.env.BASE_URL (e.g. GitHub Pages subpaths).
 */
export function publicUrl(pathFromSiteRoot) {
  const path = pathFromSiteRoot.startsWith('/') ? pathFromSiteRoot : `/${pathFromSiteRoot}`
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return path
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  return `${prefix}${path}`
}
