import { supabase } from './supabaseClient'

export const PORTFOLIO_UPDATED_EVENT = 'maywood-portfolio-updated'

export function notifyPortfolioChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PORTFOLIO_UPDATED_EVENT))
  }
}

export function mapDbRowToProject(r) {
  if (!r) return null
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    location: r.location,
    year: r.year,
    featured: Boolean(r.featured),
    image: r.image_url,
    image_url: r.image_url,
    file_name: r.file_name,
    storage_path: r.storage_path ?? r.file_name,
    uploadedAt: r.created_at,
  }
}

export async function fetchPortfolioProjects() {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('portfolio_projects:', error)
    return []
  }
  return (data || []).map(mapDbRowToProject).filter(Boolean)
}

/** Public /portfolio: rows with a usable image URL, newest first. */
export async function fetchPortfolioGalleryImages() {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('id, image_url, created_at')
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('portfolio_projects gallery:', error)
    return []
  }
  return (data || [])
    .map((r) => ({
      id: r.id,
      src: r.image_url,
    }))
    .filter((r) => r.id && r.src && String(r.src).trim() !== '')
}

function slugFileBase(name) {
  return String(name || 'project')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 72) || 'project'
}

/** @param {File} file @param {string} [nameHint] original filename stem for readability */
export async function uploadPortfolioImage(file, nameHint) {
  const stem = String(nameHint || file.name || 'image').replace(/\.[^.]+$/i, '')
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const fileName = `${unique}-${slugFileBase(stem)}.${safeExt}`
  const { error } = await supabase.storage.from('portfolio-images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data: pub } = supabase.storage.from('portfolio-images').getPublicUrl(fileName)
  return { publicUrl: pub.publicUrl, storagePath: fileName }
}

export async function removePortfolioStorageObjects(paths) {
  const list = (paths || []).filter(Boolean)
  if (!list.length) return
  await supabase.storage.from('portfolio-images').remove(list)
}

/**
 * @param {Record<string, unknown>} payload row (e.g. image_url + storage_path only)
 * @param {{ skipNotify?: boolean }} [options]
 */
export async function insertPortfolioProject(payload, options = {}) {
  const { skipNotify = false } = options
  const { data, error } = await supabase.from('portfolio_projects').insert([payload]).select().single()
  if (error) throw error
  if (!skipNotify) notifyPortfolioChanged()
  return mapDbRowToProject(data)
}

export async function updatePortfolioProject(id, patch) {
  const { error } = await supabase.from('portfolio_projects').update(patch).eq('id', id)
  if (error) throw error
  notifyPortfolioChanged()
}

export async function deletePortfolioProject(row) {
  const storageKey = row?.file_name || row?.storage_path
  if (storageKey) {
    await removePortfolioStorageObjects([storageKey])
  }
  const { error } = await supabase.from('portfolio_projects').delete().eq('id', row.id)
  if (error) throw error
  notifyPortfolioChanged()
}
