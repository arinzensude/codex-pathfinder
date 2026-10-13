import { translate } from '../i18n'
import { formatDuration } from '../lib/duration'
import { scoreCourse } from '../lib/score'
import type { Course, LearnerProfile } from '../types'

export default function CourseCard({ course, profile, number }: { course: Course; profile: LearnerProfile; number: number }) {
  const t = (key: string) => translate(key, profile.language)
  const { score, reasons } = scoreCourse(course, profile)
  const details = [
    ['course.duration', formatDuration(course.hours, profile.language)],
    ['course.cost', course.cost === null ? t('course.unknown') : t('cost.' + course.cost)],
    ['course.data', t('weight.' + course.dataWeight)],
    ['course.language', t('language.' + course.language)],
    ['course.verified', course.lastVerified ?? t('course.unknown')],
  ]
  return <li className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="mb-2 text-sm font-bold text-teal-800">{translate('path.step', profile.language, { number })}</p>
    <h2 className="break-words text-xl font-semibold">{course.title}</h2>
    <p className="mt-1 break-words text-slate-600">{course.provider}</p>
    <a href={course.url} target="_blank" rel="noopener noreferrer" className="my-3 inline-flex min-h-11 items-center font-semibold text-teal-800 underline underline-offset-4">{t('course.source')}</a>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      {details.map(([label, value]) => <div key={label}><dt className="text-slate-500">{t(label)}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
    </dl>
    {course.priceNote && <p className="mt-3 text-sm text-slate-600">{course.priceNote}</p>}
    <div className="mt-5 border-t border-slate-100 pt-4">
      <h3 className="font-semibold">{t('course.reasons')}</h3>
      <p className="my-2 text-sm text-teal-800">{translate('course.score', profile.language, { score })}</p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">{reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
    </div>
  </li>
}
