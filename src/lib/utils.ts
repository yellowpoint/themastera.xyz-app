import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function formatDateRange(dates: string[]): string {
  if (!dates || !Array.isArray(dates) || dates.length === 0) return ''

  // Parse and sort dates to be sure
  const sortedDates = dates
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  if (sortedDates.length === 0) return ''

  const start = sortedDates[0]
  const end = sortedDates[sortedDates.length - 1]

  const startStr = formatDate(start)
  const endStr = formatDate(end)

  if (startStr === endStr) {
    return startStr
  }

  return `${startStr} - ${endStr}`
}
