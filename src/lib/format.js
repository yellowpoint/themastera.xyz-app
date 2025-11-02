// Shared formatting utilities

export function formatViews(views) {
  const v = Number.isFinite(Number(views)) ? Number(views) : 0;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toString();
}

export function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(Number(seconds))) return '00:00';
  const s = Math.max(0, Math.round(Number(seconds)));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(dateInput, style = 'YYYY-MM-DD HH:mm') {
  try {
    if (!dateInput) return style === 'MM-DD-YYYY' ? '' : '-';
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) {
      // If invalid date, return original string when available, or empty string
      return typeof dateInput === 'string' ? dateInput : '';
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    if (style === 'MM-DD-YYYY') {
      return `${mm}-${dd}-${yyyy}`;
    }
    const HH = String(d.getHours()).padStart(2, '0');
    const MM = String(d.getMinutes()).padStart(2, '0');
    // Default: YYYY-MM-DD HH:mm
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
  } catch (_) {
    return style === 'MM-DD-YYYY' ? '' : '-';
  }
}