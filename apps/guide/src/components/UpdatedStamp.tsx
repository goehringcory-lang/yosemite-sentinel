export default function UpdatedStamp() {
  const date = import.meta.env.VITE_BUILD_DATE || 'dev'
  return (
    <div className="updated-stamp">
      Last updated {date} · 2026 Edition
    </div>
  )
}
