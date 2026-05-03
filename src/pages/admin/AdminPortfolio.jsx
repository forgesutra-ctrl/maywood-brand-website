import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Trash2, Upload, X } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonStyles'
import {
  PORTFOLIO_UPDATED_EVENT,
  deletePortfolioProject,
  fetchPortfolioProjects,
  insertPortfolioProject,
  notifyPortfolioChanged,
} from '../../utils/portfolioProjectsStore'
import { supabase } from '../../utils/supabaseClient'

const ACCEPT_MIME = /^image\/(jpeg|png|webp|jpg)$/i
const ACCEPT_ATTR = 'image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
const MAX_FILE_BYTES = 5 * 1024 * 1024
const GENERAL_FILE_RULE_MSG = 'Only JPG, PNG and WebP images under 5MB are allowed'

const UPLOAD_CATEGORY_OPTIONS = [
  'Kitchens',
  'Wardrobes',
  'TV Units',
  'Pooja Rooms',
  'Spas',
  'Cafes & Restaurants',
  'Offices',
  'Other',
]

/** @typedef {{ id: string; file: File; previewDataUrl: string; validationError: string | null }} PreviewItem */

function sanitizeOriginalFileName(fileName) {
  const name = String(fileName || 'image.jpg').trim()
  const lastDot = name.lastIndexOf('.')
  const base = lastDot > 0 ? name.slice(0, lastDot) : name
  let ext = lastDot > 0 ? name.slice(lastDot + 1).toLowerCase() : 'jpg'
  if (ext === 'jpeg') ext = 'jpg'
  const safeBase =
    base
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 96) || 'image'
  const safeExt = ['jpg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  return `${safeBase}.${safeExt}`
}

function buildUniqueStorageFileName(file) {
  const sanitized = sanitizeOriginalFileName(file.name)
  const rand = Math.random().toString(36).substring(2, 10)
  return `${Date.now()}-${rand}-${sanitized}`
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** @param {unknown} error @param {string} fileName */
function mapSupabaseUploadError(error, fileName = '') {
  const msg = String(
    /** @type {{ message?: string; error?: string; statusCode?: string }} */ (error)?.message ??
      /** @type {{ error?: string }} */ (error)?.error ??
      error ??
      '',
  )
  const lower = msg.toLowerCase()
  if (lower.includes('bucket') && lower.includes('not found')) {
    return 'Storage not configured. Contact developer.'
  }
  if (lower.includes('too large') || lower.includes('413') || lower.includes('payload too large')) {
    return fileName ? `File ${fileName} is too large. Max 5MB allowed.` : 'File too large. Max 5MB allowed.'
  }
  if (
    lower.includes('jwt') ||
    lower.includes('not authorized') ||
    lower.includes('not authenticated') ||
    lower.includes('permission') ||
    msg === 'Unauthorized'
  ) {
    return 'Session expired. Please log in again.'
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('failed to fetch')) {
    return 'Upload failed. Check your connection and try again.'
  }
  return msg || 'Upload failed. Please try again.'
}

/** @param {File} file */
function validateImageFile(file) {
  if (!file) return 'Invalid file.'
  let ext = (file.name.split('.').pop() || '').toLowerCase()
  if (ext === 'jpeg') ext = 'jpg'
  const extOk = ['jpg', 'png', 'webp'].includes(ext)
  const mime = (file.type || '').toLowerCase()
  const mimeOk = ACCEPT_MIME.test(mime)
  if (!mimeOk && !(mime === '' && extOk)) {
    return 'Only JPG, PNG and WebP images are accepted.'
  }
  if (file.size > MAX_FILE_BYTES) {
    return `File ${file.name} is too large. Max 5MB allowed.`
  }
  return null
}

export default function AdminPortfolio() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const toastTimerRef = useRef(null)
  const fileInputRef = useRef(null)

  const [projectName, setProjectName] = useState('')
  const [category, setCategory] = useState('Kitchens')
  const [description, setDescription] = useState('')
  /** @type {[PreviewItem[], function]} */
  const [previews, setPreviews] = useState([])
  const previewReadersRef = useRef(/** @type {Map<string, FileReader>} */ (new Map()))

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatusText, setUploadStatusText] = useState('')
  const [errorBanner, setErrorBanner] = useState(null)
  const [successBanner, setSuccessBanner] = useState(null)

  /** Load FileReader previews for new items without validation errors */
  useEffect(() => {
    previews.forEach((p) => {
      if (p.validationError || p.previewDataUrl) return
      if (previewReadersRef.current.has(p.id)) return
      const reader = new FileReader()
      previewReadersRef.current.set(p.id, reader)
      reader.onload = () => {
        setPreviews((prev) =>
          prev.map((item) =>
            item.id === p.id ? { ...item, previewDataUrl: String(reader.result || '') } : item,
          ),
        )
        previewReadersRef.current.delete(p.id)
      }
      reader.onerror = () => {
        setPreviews((prev) =>
          prev.map((item) =>
            item.id === p.id
              ? { ...item, validationError: 'Could not read this file for preview.' }
              : item,
          ),
        )
        previewReadersRef.current.delete(p.id)
      }
      reader.readAsDataURL(p.file)
    })
  }, [previews])

  useEffect(() => {
    return () => {
      previewReadersRef.current.forEach((fr) => {
        try {
          fr.abort?.()
        } catch {
          /* noop */
        }
      })
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const all = await fetchPortfolioProjects()
      setRows(all.filter((p) => p.image_url || p.image))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const onPortfolio = () => void refresh()
    window.addEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
    const onVis = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  /** @param {File[]} fileArray */
  const appendPreviewsFromFiles = (fileArray) => {
    const newItems = fileArray.map((file, idx) => {
      const id = `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 9)}`
      return {
        id,
        file,
        previewDataUrl: '',
        validationError: validateImageFile(file),
      }
    })
    setPreviews((prev) => [...prev, ...newItems])
  }

  const handleInputChange = (e) => {
    const list = e.target.files
    e.target.value = ''
    if (!list?.length) return
    appendPreviewsFromFiles(Array.from(list))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const list = e.dataTransfer?.files
    if (!list?.length) return
    appendPreviewsFromFiles(Array.from(list))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const removePreview = (id) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id))
  }

  const clearFormAndPreviews = useCallback(() => {
    previewReadersRef.current.forEach((fr) => {
      try {
        fr.abort()
      } catch {
        /* noop */
      }
    })
    previewReadersRef.current.clear()
    setPreviews([])
    setProjectName('')
    setDescription('')
    setCategory('Kitchens')
  }, [])

  const groups = useMemo(() => {
    /** @type {Record<string, typeof rows>} */
    const map = {}
    rows.forEach((r) => {
      const c = r.category && String(r.category).trim() !== '' ? String(r.category).trim() : 'Other'
      if (!map[c]) map[c] = []
      map[c].push(r)
    })
    const extraCats = Object.keys(map)
      .filter((k) => !UPLOAD_CATEGORY_OPTIONS.includes(k))
      .sort((a, b) => a.localeCompare(b))
    const order = [...UPLOAD_CATEGORY_OPTIONS, ...extraCats]
    /** @type {{ cat: string; items: typeof rows }[]} */
    const out = []
    for (const cat of order) {
      const items = map[cat]
      if (items?.length) out.push({ cat, items })
    }
    return out
  }, [rows])

  const executeUpload = async () => {
    setErrorBanner(null)
    setSuccessBanner(null)

    const nameTrim = projectName.trim()
    if (!nameTrim) {
      setErrorBanner('Please enter a project name.')
      return
    }
    if (!category || !UPLOAD_CATEGORY_OPTIONS.includes(category)) {
      setErrorBanner('Please select a category.')
      return
    }
    const eligible = previews.filter((p) => !p.validationError)
    if (eligible.length === 0) {
      if (previews.length === 0) {
        setErrorBanner('Please add at least one image.')
      } else {
        setErrorBanner(GENERAL_FILE_RULE_MSG)
      }
      return
    }

    setUploading(true)
    const total = eligible.length
    let completed = 0
    setUploadProgress(0)
    setUploadStatusText('')

    /** @type {string[]} */
    const failures = []
    let successCount = 0

    for (let i = 0; i < eligible.length; i++) {
      const preview = eligible[i]
      const fileIndex = i + 1
      setUploadStatusText(`Uploading image ${fileIndex} of ${total}...`)
      setUploadProgress(total > 0 ? Math.round((completed / total) * 100) : 0)

      try {
        const fileName = buildUniqueStorageFileName(preview.file)
        const { error: upErr } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, preview.file, { cacheControl: '3600', upsert: false })
        if (upErr) {
          failures.push(`${preview.file.name}: ${mapSupabaseUploadError(upErr, preview.file.name)}`)
          completed++
          setUploadProgress(Math.round((completed / total) * 100))
          continue
        }

        const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(fileName)
        const publicUrl = urlData?.publicUrl
        if (!publicUrl) {
          failures.push(`${preview.file.name}: Could not get public URL`)
          completed++
          setUploadProgress(Math.round((completed / total) * 100))
          continue
        }

        await insertPortfolioProject(
          {
            name: nameTrim,
            category,
            description: description.trim() || null,
            image_url: publicUrl,
            file_name: fileName,
            storage_path: fileName,
          },
          { skipNotify: true },
        )
        successCount++
      } catch (err) {
        console.error(err)
        failures.push(`${preview.file.name}: ${mapSupabaseUploadError(err, preview.file.name)}`)
      }

      completed++
      setUploadProgress(total > 0 ? Math.round((completed / total) * 100) : 100)
    }

    setUploadProgress(100)
    setUploadStatusText('')
    setUploading(false)

    notifyPortfolioChanged()
    await refresh()

    if (failures.length && successCount === 0) {
      setErrorBanner(failures.join('\n'))
    } else if (failures.length) {
      setSuccessBanner(`✓ ${successCount} images uploaded successfully to ${category}`)
      setErrorBanner(`Some uploads failed:\n${failures.join('\n')}`)
      clearFormAndPreviews()
    } else {
      setSuccessBanner(`✓ ${successCount} images uploaded successfully to ${category}`)
      clearFormAndPreviews()
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = window.setTimeout(() => setSuccessBanner(null), 6000)
    }
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  const requestDelete = (p) => {
    const nm = typeof p?.name === 'string' && p.name.trim() ? p.name.trim() : 'this project'
    const ok = window.confirm(
      `Are you sure you want to delete ${nm}? This cannot be undone.`,
    )
    if (!ok) return
    void confirmDelete(p)
  }

  const confirmDelete = async (p) => {
    setErrorBanner(null)
    try {
      await deletePortfolioProject(p)
      setRows((prev) => prev.filter((r) => r.id !== p.id))
    } catch (err) {
      console.error(err)
      setErrorBanner(mapSupabaseUploadError(err))
    }
  }

  const formatUploadDate = (iso) => {
    if (!iso) return ''
    try {
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso))
    } catch {
      return String(iso)
    }
  }

  const showSkeleton = loading && rows.length === 0

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">Portfolio Images</h1>
        <p className="mt-1 max-w-xl font-body text-[14px] text-brand-mist">
          Upload or remove images that appear on the public Portfolio page
        </p>
      </div>

      {errorBanner ? (
        <div
          role="alert"
          className="whitespace-pre-wrap rounded-xl bg-red-600 px-4 py-3 font-body text-[13px] text-white shadow-sm"
        >
          {errorBanner}
        </div>
      ) : null}

      {successBanner ? (
        <div role="status" className="rounded-xl bg-emerald-600 px-4 py-3 font-body text-[13px] text-white shadow-sm">
          {successBanner}
        </div>
      ) : null}

      <section className="rounded-xl border border-brand-brass-pale/50 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="admin-portfolio-project-name" className="mb-2 block font-body text-[12px] font-semibold uppercase tracking-wide text-brand-charcoal">
              Project name <span className="text-red-600">*</span>
            </label>
            <input
              id="admin-portfolio-project-name"
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Sharma Residence Kitchen"
              disabled={uploading}
              className="w-full rounded-lg border border-brand-brass-pale/60 bg-white px-4 py-2.5 font-body text-[14px] text-brand-charcoal placeholder:text-brand-mist/50 focus:border-brand-brass focus:outline-none focus:ring-1 focus:ring-brand-brass disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="admin-portfolio-category-field" className="mb-2 block font-body text-[12px] font-semibold uppercase tracking-wide text-brand-charcoal">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="admin-portfolio-category-field"
              required
              value={category}
              disabled={uploading}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full max-w-md rounded-lg border border-brand-brass-pale/60 bg-white px-4 py-2.5 font-body text-[14px] text-brand-charcoal focus:border-brand-brass focus:outline-none focus:ring-1 focus:ring-brand-brass disabled:opacity-60"
            >
              {UPLOAD_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-body text-[12px] font-semibold uppercase tracking-wide text-brand-charcoal">
              Images <span className="text-red-600">*</span>
              <span className="mt-1 block font-body text-[11px] font-normal normal-case tracking-normal text-brand-mist">
                {GENERAL_FILE_RULE_MSG}
              </span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={[
                'rounded-xl border-2 border-dashed border-brand-brass/45 bg-brand-ivory-deep/50 transition-colors',
                uploading ? 'pointer-events-none opacity-60' : 'hover:border-brand-brass hover:bg-brand-brass-pale/25',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex min-h-[140px] w-full flex-col items-center justify-center px-4 py-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass rounded-[10px]"
              >
                <Upload className="mb-2 h-10 w-10 text-brand-brass/80" strokeWidth={1.25} aria-hidden />
                <span className="font-body text-[14px] text-brand-charcoal">Drag images here or click to browse</span>
                <span className="mt-2 font-body text-[12px] text-brand-mist">Multiple selection allowed</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_ATTR}
              multiple
              className="hidden"
              disabled={uploading}
              onChange={handleInputChange}
            />
          </div>

          {previews.length > 0 ? (
            <ul className="space-y-3">
              {previews.map((p) => (
                <li
                  key={p.id}
                  className={[
                    'flex items-start gap-3 rounded-lg border p-3',
                    p.validationError ? 'border-red-300 bg-red-50/50' : 'border-brand-brass-pale/45 bg-brand-ivory-deep/40',
                  ].join(' ')}
                >
                  <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-brand-ivory-deep">
                    {p.previewDataUrl ? (
                      <img src={p.previewDataUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-body text-[10px] text-brand-mist">
                        …
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-[13px] font-medium text-brand-charcoal">{p.file.name}</p>
                    <p className="font-body text-[12px] text-brand-mist">{formatFileSize(p.file.size)}</p>
                    {p.validationError ? (
                      <p className="mt-1 font-body text-[12px] text-red-600">{p.validationError}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePreview(p.id)}
                    disabled={uploading}
                    className="shrink-0 rounded-full border border-transparent p-2 text-brand-charcoal transition-colors hover:bg-red-600 hover:text-white disabled:opacity-40"
                    aria-label="Remove image from queue"
                  >
                    <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div>
            <label htmlFor="admin-portfolio-description" className="mb-2 block font-body text-[12px] font-semibold uppercase tracking-wide text-brand-charcoal">
              Description <span className="font-normal text-brand-mist">(optional)</span>
            </label>
            <textarea
              id="admin-portfolio-description"
              rows={4}
              value={description}
              disabled={uploading}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project"
              className="w-full resize-y rounded-lg border border-brand-brass-pale/60 bg-white px-4 py-2.5 font-body text-[14px] text-brand-charcoal placeholder:text-brand-mist/50 focus:border-brand-brass focus:outline-none focus:ring-1 focus:ring-brand-brass disabled:opacity-60"
            />
          </div>

          <button
            type="button"
            disabled={uploading}
            onClick={() => void executeUpload()}
            className={buttonClasses('primary', 'w-full px-6 py-3 text-[11px] disabled:opacity-60 sm:w-auto')}
          >
            UPLOAD PORTFOLIO
          </button>
        </div>

        {uploading ? (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <p className="font-body text-[13px] font-medium text-brand-charcoal">{uploadStatusText}</p>
              <p className="font-body text-[12px] text-brand-brass">{uploadProgress}%</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-brand-charcoal">
              <div
                className="h-full rounded-full bg-[#c9a465] transition-[width] duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}
      </section>

      <div>
        <h2 className="font-display text-[20px] font-light text-brand-charcoal lg:text-[22px]">Uploaded images</h2>
        <p className="mt-1 font-body text-[13px] text-brand-mist">Ordered newest first • grouped by category</p>

        {showSkeleton ? (
          <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-lg border border-brand-brass-pale/40 bg-white shadow-sm">
            <Loader2 className="h-10 w-10 animate-spin text-brand-brass" aria-label="Loading" />
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-brass-pale/55 bg-white/80 px-6 py-12 text-center">
            <Upload className="mb-3 h-10 w-10 text-brand-brass/70" strokeWidth={1.25} aria-hidden />
            <p className="max-w-md font-body text-[15px] text-brand-mist">
              No images yet. Upload your first portfolio project above.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {groups.map(({ cat, items }) => (
              <div key={cat}>
                <h3 className="mb-4 font-body text-[15px] font-semibold tracking-normal text-brand-charcoal">
                  {cat}{' '}
                  <span className="font-medium text-brand-mist">({items.length})</span>
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => {
                    const src = p.image || p.image_url
                    const uploaded = p.uploadedAt || ''
                    return (
                      <article
                        key={p.id}
                        className="overflow-hidden rounded-lg border border-brand-brass-pale/40 bg-white shadow-sm"
                      >
                        <div className="relative aspect-[4/3] w-full bg-brand-ivory-deep">
                          <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                          <button
                            type="button"
                            onClick={() => requestDelete(p)}
                            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Delete project"
                          >
                            <Trash2 className="h-5 w-5" strokeWidth={2} aria-hidden />
                          </button>
                        </div>
                        <div className="space-y-2 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex rounded-full border border-brand-brass-pale bg-brand-brass-pale/30 px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal">
                              {p.category || 'Other'}
                            </span>
                          </div>
                          <p className="font-body text-[14px] font-medium text-brand-charcoal">
                            {p.name?.trim?.() ? p.name : 'Untitled project'}
                          </p>
                          <p className="font-body text-[11px] text-brand-mist">{formatUploadDate(uploaded)}</p>
                          {typeof p.description === 'string' && p.description.trim() ? (
                            <p className="line-clamp-3 font-body text-[12px] leading-relaxed text-brand-mist">
                              {p.description.trim()}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
