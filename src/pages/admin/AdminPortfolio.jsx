import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonStyles'
import {
  PORTFOLIO_UPDATED_EVENT,
  deletePortfolioProject,
  fetchPortfolioProjects,
  insertPortfolioProject,
  notifyPortfolioChanged,
  uploadPortfolioImage,
} from '../../utils/portfolioProjectsStore'

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
const MAX_FILE_BYTES = 2 * 1024 * 1024

export default function AdminPortfolio() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)
  const fileInputRef = useRef(null)

  const [uploading, setUploading] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
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
    refresh()
  }, [refresh])

  useEffect(() => {
    const onPortfolio = () => refresh()
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

  const openFilePicker = () => fileInputRef.current?.click()

  const validateFile = (file) => {
    if (!file) return 'Invalid file.'
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      return 'Please use JPG, PNG, or WEBP.'
    }
    if (file.size > MAX_FILE_BYTES) {
      return 'Max size per image is 2MB.'
    }
    return null
  }

  const handleFilesSelected = async (e) => {
    const list = e.target.files
    if (!list?.length) return
    const files = Array.from(list)
    e.target.value = ''

    const validFiles = []
    for (const file of files) {
      const err = validateFile(file)
      if (err) showToast(err)
      else validFiles.push(file)
    }
    if (!validFiles.length) return

    setUploading({ current: 0, total: validFiles.length })
    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setUploading({ current: i + 1, total: validFiles.length })
        try {
          const { publicUrl, storagePath } = await uploadPortfolioImage(file)
          const mapped = await insertPortfolioProject(
            {
              image_url: publicUrl,
              storage_path: storagePath,
            },
            { skipNotify: true },
          )
          if (mapped) {
            setRows((prev) => [mapped, ...prev.filter((r) => r.id !== mapped.id)])
          }
        } catch (err) {
          console.error(err)
          showToast(`Failed to upload ${file.name}. Please try again.`)
        }
      }
      notifyPortfolioChanged()
    } finally {
      setUploading(null)
    }
  }

  const requestDelete = (p) => {
    const ok = window.confirm('Remove this image from the portfolio?')
    if (!ok) return
    void confirmDelete(p)
  }

  const confirmDelete = async (p) => {
    try {
      await deletePortfolioProject(p)
      setRows((prev) => prev.filter((r) => r.id !== p.id))
    } catch (err) {
      console.error(err)
      showToast('Could not remove image. Please try again.')
    }
  }

  const showSkeleton = loading && rows.length === 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">Portfolio Images</h1>
          <p className="mt-1 max-w-xl font-body text-[14px] text-brand-mist">
            Upload or remove images that appear on the public Portfolio page
          </p>
        </div>
        <button
          type="button"
          onClick={openFilePicker}
          disabled={Boolean(uploading)}
          className={buttonClasses('primary', 'shrink-0 px-6 py-3 text-[11px] disabled:opacity-60')}
        >
          UPLOAD IMAGES
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {uploading ? (
        <div
          className="flex items-center gap-3 rounded-lg border border-brand-brass-pale/40 bg-white px-4 py-3 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand-brass" aria-hidden />
          <p className="font-body text-[13px] text-brand-charcoal">
            Uploading image {uploading.current} of {uploading.total}…
          </p>
        </div>
      ) : null}

      {showSkeleton ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-brand-brass-pale/40 bg-white shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-brand-brass" aria-label="Loading" />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-brass-pale/55 bg-white/80 px-6 py-16 text-center">
          <Upload className="mb-4 h-12 w-12 text-brand-brass/70" strokeWidth={1.25} aria-hidden />
          <p className="max-w-md font-body text-[15px] text-brand-mist">
            No images yet. Click &apos;Upload Images&apos; to add your first photo.
          </p>
          <button
            type="button"
            onClick={openFilePicker}
            disabled={Boolean(uploading)}
            className={buttonClasses('primary', 'mt-8 px-8 py-3 text-[11px] disabled:opacity-60')}
          >
            UPLOAD IMAGES
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {rows.map((p) => {
            const src = p.image || p.image_url
            return (
              <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-brand-brass-pale/40 bg-brand-ivory-deep shadow-sm">
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-charcoal/0 opacity-0 transition-opacity duration-200 group-hover:bg-brand-charcoal/65 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => requestDelete(p)}
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
