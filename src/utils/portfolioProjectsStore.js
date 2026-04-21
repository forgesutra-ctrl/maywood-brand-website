import { supabase } from './supabaseClient'

export const PORTFOLIO_UPDATED_EVENT = 'maywood-portfolio-updated'

export const PORTFOLIO_CATEGORIES = [
  'Home Interiors',
  'Corporate & Office Spaces',
  'Spas & Salons',
  'Retail Spaces',
  'Hospitality',
  'Others',
]

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
    location: r.location,
    year: r.year,
    featured: Boolean(r.featured),
    image: r.image_url,
    image_url: r.image_url,
    storage_path: r.storage_path,
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
  return (data || []).map(mapDbRowToProject)
}

export async function fetchFeaturedPortfolioProjects(limit = 5) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('portfolio_projects featured:', error)
    return []
  }
  return (data || []).map(mapDbRowToProject)
}

function slugFileBase(name) {
  return String(name || 'project')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 72) || 'project'
}

export async function uploadPortfolioImage(file, projectName) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  const fileName = `${Date.now()}-${slugFileBase(projectName)}.${safeExt}`
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

export async function insertPortfolioProject(payload) {
  const { error } = await supabase.from('portfolio_projects').insert([payload])
  if (error) throw error
  notifyPortfolioChanged()
}

export async function updatePortfolioProject(id, patch) {
  const { error } = await supabase.from('portfolio_projects').update(patch).eq('id', id)
  if (error) throw error
  notifyPortfolioChanged()
}

export async function deletePortfolioProject(row) {
  if (row?.storage_path) {
    await removePortfolioStorageObjects([row.storage_path])
  }
  const { error } = await supabase.from('portfolio_projects').delete().eq('id', row.id)
  if (error) throw error
  notifyPortfolioChanged()
}
