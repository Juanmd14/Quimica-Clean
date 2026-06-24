export type BusinessStatus = 'open' | 'closing-soon' | 'lunch' | 'closed'

const TZ = 'America/Argentina/Buenos_Aires'

function getArParts(now: Date): { day: number; minutes: number } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(now)
  const weekday = parts.find(p => p.type === 'weekday')?.value ?? 'Sun'
  const hourStr = parts.find(p => p.type === 'hour')?.value ?? '0'
  const minuteStr = parts.find(p => p.type === 'minute')?.value ?? '0'
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const day = dayMap[weekday] ?? 0
  let hour = parseInt(hourStr, 10)
  if (hour === 24) hour = 0
  return { day, minutes: hour * 60 + parseInt(minuteStr, 10) }
}

export function getBusinessStatus(now: Date = new Date()): BusinessStatus {
  const { day, minutes } = getArParts(now)

  if (day === 0) return 'closed'

  if (day === 6) {
    if (minutes >= 8 * 60 && minutes < 13 * 60) {
      return minutes >= 12 * 60 + 30 ? 'closing-soon' : 'open'
    }
    return 'closed'
  }

  const morningStart = 8 * 60
  const morningEnd = 13 * 60 + 30
  const afternoonStart = 14 * 60 + 30
  const afternoonEnd = 18 * 60

  if (minutes >= morningStart && minutes < morningEnd) {
    return minutes >= morningEnd - 30 ? 'closing-soon' : 'open'
  }
  if (minutes >= morningEnd && minutes < afternoonStart) return 'lunch'
  if (minutes >= afternoonStart && minutes < afternoonEnd) {
    return minutes >= afternoonEnd - 30 ? 'closing-soon' : 'open'
  }
  return 'closed'
}

const DAY_NAMES_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

export function getNextOpenAt(now: Date = new Date()): string {
  const { day, minutes } = getArParts(now)

  if (day >= 1 && day <= 5) {
    if (minutes < 8 * 60) return 'Abrimos hoy a las 8:00'
    if (minutes >= 13 * 60 + 30 && minutes < 14 * 60 + 30) return 'Volvemos a las 14:30'
    if (minutes >= 18 * 60) {
      if (day === 5) return 'Abrimos el sábado a las 8:00'
      return 'Abrimos mañana a las 8:00'
    }
  }
  if (day === 6) {
    if (minutes < 8 * 60) return 'Abrimos hoy a las 8:00'
    if (minutes >= 13 * 60) return 'Abrimos el lunes a las 8:00'
  }
  if (day === 0) return 'Abrimos el lunes a las 8:00'

  return `Próxima atención: ${DAY_NAMES_ES[(day + 1) % 7]} a las 8:00`
}
