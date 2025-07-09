export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function getFirstDayOfMonth(): Date {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const firstOfMonth = new Date(currentYear, currentMonth, 1)
  return firstOfMonth
}

export function getYesterday(): Date {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
}

export const getThisWeekStart = (): Date => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - (day === 0 ? 6 : day - 1)
  return new Date(today.getFullYear(), today.getMonth(), diff)
}

export const getLastWeekStart = (): Date => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - ((day === 0 ? 6 : day - 1) + 7)
  return new Date(today.getFullYear(), today.getMonth(), diff)
}
