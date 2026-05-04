import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonStyles'
import {
  PORTFOLIO_UPDATED_EVENT,
  deletePortfolioProject,
  fetchPortfolioProjects,
  insertPortfolioProject,
  notifyPortfolioChanged,
} from '../../utils/portfolioProjectsStore'
import { supabase } from '../../utils/supabaseClient'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
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

export default function AdminPortfolio() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const toastTimerRef = useRef(null)
  const fileInputRef = useRef(null)

  const [projectName, setProjectName] = useState('')
  const [category, setCategory] = useState('Kitchens')
  const [description, setDescription] = useState('')

  const [selectedFiles, setSelectedFiles] = useState([])
  /** @type {{ name: string; size: string; url: string; file: File }[]} */
  const [previews, setPreviews] = useState([])

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [errorBanner, setErrorBanner] = useState(null)

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

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const revokePreviewUrls = useCallback(() => {
    setPreviews((prev) => {
      prev.forEach((p) => {
        try {
          if (String(p.url).startsWith('blob:')) URL.revokeObjectURL(p.url)
        } catch {
          /* noop */
        }
      })
      return []
    })
  }, [])

  const ingestFilesWithValidation = async (rawFiles) => {
    const files = Array.from(rawFiles || [])
    if (files.length === 0) return

    setUploadSuccess('')

    const valid = []
    const errors = []

    files.forEach((file) => {
      const type = String(file.type || '').toLowerCase()
      let ext = (file.name.split('.').pop() || '').toLowerCase()
      if (ext === 'jpeg') ext = 'jpg'
      const mimeOk = ACCEPT_TYPES.includes(type)
      const extOk = ['jpg', 'png', 'webp'].includes(ext)
      const typeOk = mimeOk || (type === '' && extOk)

      if (file.size > MAX_FILE_BYTES) {
        errors.push(`${file.name} is too large (max 5MB)`)
      } else if (!typeOk) {
        errors.push(`${file.name} is not a valid image type`)
      } else {
        valid.push(file)
      }
    })

    if (errors.length > 0) {
      setUploadError(errors.join(', '))
    } else {
      setUploadError('')
    }

    if (valid.length > 0) {
      try {
        const entries = await Promise.all(
          valid.map(
            (file) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (event) =>
                  resolve({
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(0)} KB`,
                    url: String(event.target?.result || ''),
                    file,
                  })
                reader.onerror = () => reject(new Error(file.name))
                reader.readAsDataURL(file)
              }),
          ),
        )

        setSelectedFiles((prev) => [...prev, ...valid])
        setPreviews((prev) => [...prev, ...entries])
      } catch {
        setUploadError('Could not preview one or more images. Try again.')
      }
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    void ingestFilesWithValidation(files).finally(() => {
      // Reset input so same file can be selected again.
      try {
        e.target.value = ''
      } catch {
        /* noop */
      }
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    void ingestFilesWithValidation(e.dataTransfer?.files)
  }

  const removePreviewAt = (i) => {
    setPreviews((prev) => {
      const row = prev[i]
      try {
        if (row?.url?.startsWith('blob:')) URL.revokeObjectURL(row.url)
      } catch {
        /* noop */
      }
      return prev.filter((_, idx) => idx !== i)
    })
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))
  }

  const clearFormAfterUpload = useCallback(() => {
    revokePreviewUrls()
    setSelectedFiles([])
    setProjectName('')
    setUploadProgress(0)
    setDescription('')
    setCategory('Kitchens')
  }, [revokePreviewUrls])

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

  const handleUpload = async () => {
    const nameTrim = projectName.trim()
    if (!nameTrim) {
      setUploadError('Please enter a project name')
      return
    }
    if (!category || !UPLOAD_CATEGORY_OPTIONS.includes(category)) {
      setUploadError('Please select a category')
      return
    }
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one image')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadSuccess('')
    setErrorBanner(null)
    /** @type {{ success: number; failed: string[] }} */
    const results = { success: 0, failed: [] }

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadProgress(Math.round((i / selectedFiles.length) * 100))

        try {
          const rawExt = (file.name.split('.').pop() || 'jpg').toLowerCase()
          const ext = rawExt === 'jpeg' ? 'jpg' : rawExt
          const baseName = String(file.name.replace(/\.[^.]+$/, '') || 'image').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'image'
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${baseName}.${ext}`

          const { error: storageError } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file, { cacheControl: '3600', upsert: false })

          if (storageError) throw storageError

          const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(fileName)

          await insertPortfolioProject(
            {
              name: nameTrim,
              category,
              description: description.trim() || null,
              image_url: urlData.publicUrl,
              file_name: fileName,
              storage_path: fileName,
            },
            { skipNotify: true },
          )
          results.success++
        } catch (err) {
          results.failed.push(`${file.name}: ${mapSupabaseUploadError(err, file.name)}`)
        }
      }

      setUploadProgress(100)

      if (results.failed.length > 0) {
        setUploadError(`${results.failed.length} file(s) failed: ${results.failed.join(', ')}`)
      }

      if (results.success > 0) {
        const plural = results.success > 1 ? 's' : ''
        setUploadSuccess(`✓ ${results.success} image${plural} uploaded successfully to ${category}`)
        clearFormAfterUpload()
        notifyPortfolioChanged()
        await refresh()
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
        toastTimerRef.current = window.setTimeout(() => setUploadSuccess(''), 6000)
      }
    } finally {
      setUploading(false)
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

      {uploadError ? (
        <div
          role="alert"
          className="whitespace-pre-wrap rounded-xl bg-red-700 px-4 py-3 font-body text-[13px] text-white shadow-sm"
        >
          {uploadError}
        </div>
      ) : null}

      {uploadSuccess ? (
        <div role="status" className="rounded-xl bg-emerald-600 px-4 py-3 font-body text-[13px] text-white shadow-sm">
          {uploadSuccess}
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
              role="presentation"
              onClick={() => {
                if (!uploading) fileInputRef.current?.click()
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={[
                'cursor-pointer rounded-xl border-2 border-dashed border-brand-brass/45 bg-brand-ivory-deep/50 transition-colors',
                uploading ? 'pointer-events-none cursor-default opacity-60' : 'hover:border-brand-brass hover:bg-brand-brass-pale/25',
              ].join(' ')}
            >
              <div className="flex min-h-[140px] w-full flex-col items-center justify-center px-4 py-8 text-center rounded-[10px]">
                <Upload className="mb-2 h-10 w-10 text-brand-brass/80" strokeWidth={1.25} aria-hidden />
                <span className="font-body text-[14px] text-brand-charcoal">Drag images here or click to browse</span>
                <span className="mt-2 font-body text-[12px] text-brand-mist">Multiple selection allowed</span>
              </div>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
              disabled={uploading}
            />
          </div>

          {previews.map((preview, i) => (
            <div
              key={`${preview.name}-${i}`}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', border: '1px solid #e0dbd4', borderRadius: '6px', marginTop: '8px' }}
            >
              <img src={preview.url} alt={preview.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#1a1612' }}>{preview.name}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>{preview.size}</p>
              </div>
              <button
                type="button"
                onClick={() => removePreviewAt(i)}
                disabled={uploading}
                style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '18px' }}
              >
                ×
              </button>
            </div>
          ))}

          {selectedFiles.length > 0 ? (
            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={uploading}
              className={buttonClasses('primary', 'w-full px-6 py-3 text-[11px] disabled:opacity-60 sm:w-auto')}
            >
              {uploading
                ? `Uploading... ${uploadProgress}%`
                : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
            </button>
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
        </div>

        {uploading ? (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <p className="font-body text-[13px] font-medium text-brand-charcoal">Uploading portfolio images…</p>
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
