// Shared formatting utilities (TypeScript)

export function formatViews(views: number | string | null | undefined): string {
  const v = Number.isFinite(Number(views)) ? Number(views) : 0
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v.toString()
}

export function formatDuration(seconds: number | string | null | undefined): string {
  if (seconds == null || Number.isNaN(Number(seconds))) return '00:00'
  const s = Math.max(0, Math.round(Number(seconds)))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export type DateFormatStyle = 'YYYY-MM-DD HH:mm' | 'MM-DD-YYYY'

export function formatDate(
  dateInput: string | number | Date | null | undefined,
  style: DateFormatStyle = 'YYYY-MM-DD HH:mm'
): string {
  try {
    if (!dateInput) return style === 'MM-DD-YYYY' ? '' : '-'
    const d = new Date(dateInput)
    if (Number.isNaN(d.getTime())) {
      return typeof dateInput === 'string' ? dateInput : ''
    }
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    if (style === 'MM-DD-YYYY') {
      return `${mm}-${dd}-${yyyy}`
    }
    const HH = String(d.getHours()).padStart(2, '0')
    const MM = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}`
  } catch (_) {
    return style === 'MM-DD-YYYY' ? '' : '-'
  }
}

export function formatTimeAgo(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}