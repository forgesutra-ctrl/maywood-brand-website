/**
 * Temporary shell until individual admin pages are built.
 */
export default function AdminPlaceholderPage({ title }) {
  return (
    <div className="rounded-sm border border-brand-brass-pale/60 bg-white p-8 shadow-sm">
      <p className="font-body text-[15px] text-brand-mist">
        <span className="font-medium text-brand-charcoal">{title}</span> — content coming in a follow-up update.
      </p>
    </div>
  )
}
