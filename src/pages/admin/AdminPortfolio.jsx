import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonStyles'
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_UPDATED_EVENT,
  deletePortfolioProject,
  fetchPortfolioProjects,
  insertPortfolioProject,
  removePortfolioStorageObjects,
  updatePortfolioProject,
  uploadPortfolioImage,
} from '../../utils/portfolioProjectsStore'

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_STORE_BYTES = 1024 * 1024

const inputClass =
  'w-full rounded-sm border border-brand-brass-pale/50 bg-white px-3 py-2.5 font-body text-[14px] text-brand-charcoal outline-none focus:border-brand-brass focus:ring-2 focus:ring-brand-brass/20'

const labelClass = 'mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist'

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'featured', label: 'Featured First' },
]

function sortProjects(list, sortId) {
  const copy = [...list]
  if (sortId === 'oldest') {
    copy.sort((a, b) => new Date(a.uploadedAt || 0) - new Date(b.uploadedAt || 0))
    return copy
  }
  if (sortId === 'featured') {
    copy.sort((a, b) => {
      if (Boolean(b.featured) !== Boolean(a.featured)) return b.featured ? 1 : -1
      return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0)
    })
    return copy
  }
  copy.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0))
  return copy
}

export default function AdminPortfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const [filterCategory, setFilterCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortId, setSortId] = useState('newest')

  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState(PORTFOLIO_CATEGORIES[0])
  const [formLocation, setFormLocation] = useState('')
  const [formYear, setFormYear] = useState(2025)
  const [formFeatured, setFormFeatured] = useState(false)
  const [formFile, setFormFile] = useState(null)
  const [formPreview, setFormPreview] = useState('')
  const [existingImage, setExistingImage] = useState('')
  const [existingStoragePath, setExistingStoragePath] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setProjects(await fetchPortfolioProjects())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onPortfolio = () => {
      refresh()
    }
    window.addEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  const resetForm = () => {
    setEditingId(null)
    setFormName('')
    setFormCategory(PORTFOLIO_CATEGORIES[0])
    setFormLocation('')
    setFormYear(2025)
    setFormFeatured(false)
    setFormFile(null)
    setFormPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return ''
    })
    setExistingImage('')
    setExistingStoragePath('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openCreate = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setFormPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return ''
    })
    setEditingId(p.id)
    setFormName(p.name || '')
    setFormCategory(PORTFOLIO_CATEGORIES.includes(p.category) ? p.category : PORTFOLIO_CATEGORIES[0])
    setFormLocation(p.location || '')
    setFormYear(Number(p.year) || 2025)
    setFormFeatured(Boolean(p.featured))
    setFormFile(null)
    setFormPreview('')
    setExistingImage(p.image || p.image_url || '')
    setExistingStoragePath(p.storage_path || '')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setModalOpen(true)
  }

  const applyFile = (file) => {
    if (!file) return
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      showToast('Please use JPG, PNG, or WEBP.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      showToast('Max file size is 5MB.')
      return
    }
    setFormFile(file)
    const url = URL.createObjectURL(file)
    setFormPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return url
    })
  }

  const handleFileInput = (e) => {
    const f = e.target.files?.[0]
    applyFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    applyFile(f)
  }

  const closeModal = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = formName.trim()
    if (!name) {
      showToast('Please enter a project name.')
      return
    }

    const yearNum = Number(formYear) || 2025
    const baseFields = {
      name,
      category: formCategory,
      location: formLocation.trim(),
      year: yearNum,
      featured: formFeatured,
    }

    try {
      if (editingId != null) {
        if (formFile) {
          if (formFile.size > MAX_STORE_BYTES) {
            showToast('Image too large. Please compress to under 1MB before uploading.')
            return
          }
          const { publicUrl, storagePath } = await uploadPortfolioImage(formFile, name)
          if (existingStoragePath) {
            await removePortfolioStorageObjects([existingStoragePath])
          }
          await updatePortfolioProject(editingId, {
            ...baseFields,
            image_url: publicUrl,
            storage_path: storagePath,
          })
        } else {
          if (!existingImage) {
            showToast('Please add an image.')
            return
          }
          await updatePortfolioProject(editingId, baseFields)
        }
        showToast('Project updated successfully')
      } else {
        if (!formFile) {
          showToast('Please add an image.')
          return
        }
        if (formFile.size > MAX_STORE_BYTES) {
          showToast('Image too large. Please compress to under 1MB before uploading.')
          return
        }
        const { publicUrl, storagePath } = await uploadPortfolioImage(formFile, name)
        await insertPortfolioProject({
          ...baseFields,
          image_url: publicUrl,
          storage_path: storagePath,
        })
        showToast('Project added successfully')
      }
    } catch (err) {
      console.error(err)
      showToast(err?.message || 'Could not save. Check Supabase storage and table setup.')
      return
    }

    closeModal()
    await refresh()
  }

  const handleDelete = async (p) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await deletePortfolioProject(p)
      showToast('Project removed')
      await refresh()
    } catch (err) {
      console.error(err)
      showToast('Could not delete project.')
    }
  }

  const filteredSorted = useMemo(() => {
    let list = [...projects]
    if (filterCategory !== 'All') {
      list = list.filter((p) => p.category === filterCategory)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => (p.name || '').toLowerCase().includes(q))
    }
    return sortProjects(list, sortId)
  }, [projects, filterCategory, search, sortId])

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-brand-brass-pale/40 bg-white shadow-sm">
        <Loader2 className="h-10 w-10 animate-spin text-brand-brass" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">Portfolio Manager</h1>
          <p className="mt-1 max-w-xl font-body text-[14px] text-brand-mist">
            Images added here appear instantly on the public Portfolio page
          </p>
        </div>
        <button type="button" onClick={openCreate} className={buttonClasses('primary', 'shrink-0 px-6 py-3 text-[11px]')}>
          ADD NEW PROJECT
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-brand-brass-pale/35 bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
        <div className="min-w-[160px] flex-1">
          <label className={labelClass} htmlFor="pf-cat">
            Category
          </label>
          <select id="pf-cat" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={inputClass}>
            <option value="All">All</option>
            {PORTFOLIO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[200px] flex-[2]">
          <label className={labelClass} htmlFor="pf-search">
            Search by name
          </label>
          <input
            id="pf-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Project name…"
            className={inputClass}
          />
        </div>
        <div className="min-w-[180px] flex-1">
          <label className={labelClass} htmlFor="pf-sort">
            Sort
          </label>
          <select id="pf-sort" value={sortId} onChange={(e) => setSortId(e.target.value)} className={inputClass}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSorted.map((p) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-lg border border-brand-brass-pale/40 bg-white shadow-sm"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-brand-ivory-deep">
              <img src={p.image} alt="" className="h-full w-full object-cover object-center" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm bg-brand-brass/15 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-charcoal">
                  {p.category}
                </span>
                {p.featured ? (
                  <span className="rounded-sm border border-brand-brass px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-brass">
                    Featured
                  </span>
                ) : null}
              </div>
              <h2 className="font-display text-[18px] font-normal leading-snug text-brand-charcoal">{p.name}</h2>
              {p.location ? (
                <p className="font-body text-[13px] text-brand-mist">{p.location}</p>
              ) : null}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="flex-1 rounded-sm border border-brand-brass-pale/60 py-2 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-brand-charcoal transition-colors hover:border-brand-brass"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="flex-1 rounded-sm border border-red-200 bg-red-50/80 py-2 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-red-800 transition-colors hover:bg-red-100"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredSorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-brand-brass-pale/50 bg-white/60 py-12 text-center font-body text-[14px] text-brand-mist">
          No projects match your filters.
        </p>
      ) : null}

      {modalOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-charcoal/60 px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          onClick={closeModal}
        >
          <div
            className="max-h-[min(92vh,900px)] w-full max-w-lg overflow-y-auto rounded-lg border border-brand-brass-pale/40 bg-brand-ivory p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="portfolio-modal-title" className="font-display text-[22px] font-light text-brand-charcoal">
              {editingId != null ? 'Edit project' : 'New project'}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <p className={labelClass}>Image</p>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={[
                    'flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed px-4 py-8 text-center transition-colors',
                    dragOver ? 'border-brand-brass bg-brand-brass/10' : 'border-brand-brass-pale/50 bg-white hover:border-brand-brass/50',
                  ].join(' ')}
                >
                  <input ref={fileInputRef} type="file" accept={ACCEPT} className="hidden" onChange={handleFileInput} />
                  {formPreview ? (
                    <img src={formPreview} alt="" className="mb-3 max-h-40 rounded-sm object-contain" />
                  ) : existingImage ? (
                    <img src={existingImage} alt="" className="mb-3 max-h-40 rounded-sm object-contain" />
                  ) : null}
                  <p className="font-body text-[13px] text-brand-charcoal">
                    Drag and drop or click to browse
                  </p>
                  <p className="mt-1 font-body text-[11px] text-brand-mist">JPG, PNG, WEBP · max 5MB · store under 1MB</p>
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="pf-name">
                  Project name
                </label>
                <input
                  id="pf-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder='e.g. "3BHK Full Home — Whitefield"'
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="pf-form-cat">
                  Category
                </label>
                <select id="pf-form-cat" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className={inputClass}>
                  {PORTFOLIO_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="pf-loc">
                  Location
                </label>
                <input
                  id="pf-loc"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Whitefield, Bangalore"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="pf-year">
                  Year
                </label>
                <input
                  id="pf-year"
                  type="number"
                  min={1990}
                  max={2100}
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value) || 2025)}
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-sm border border-brand-brass-pale/40 bg-white px-3 py-3">
                <span className="font-body text-[13px] text-brand-charcoal">Show this project prominently</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formFeatured}
                  onClick={() => setFormFeatured((v) => !v)}
                  className={[
                    'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                    formFeatured ? 'bg-brand-brass' : 'bg-brand-brass-pale/50',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                      formFeatured ? 'left-6' : 'left-0.5',
                    ].join(' ')}
                  />
                </button>
              </div>

              <button type="submit" className={buttonClasses('primary', 'w-full py-3.5 text-[11px]')}>
                {editingId != null ? 'SAVE PROJECT' : 'UPLOAD PROJECT'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-sm border border-brand-brass bg-transparent py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.1em] text-brand-brass transition-colors hover:bg-brand-brass/10"
              >
                CANCEL
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[300] max-w-sm rounded-sm border border-brand-brass-pale/50 bg-brand-charcoal px-4 py-3 font-body text-[13px] text-brand-ivory shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}
