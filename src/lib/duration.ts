import { translate, type Language } from '../i18n'

export function formatDuration(hours: number | null, language: Language): string {
  if (hours === null || !Number.isFinite(hours) || hours < 0) return translate('course.unknown', language)
  const minutes = Math.round(hours * 60)
  if (hours < 1) return translate('duration.minutes', language, { minutes })
  const wholeHours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return translate(remainder ? 'duration.hoursMinutes' : 'duration.hours', language,
    { hours: wholeHours, minutes: remainder })
}
