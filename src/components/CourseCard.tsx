import { translate } from '../i18n'
import { formatDuration } from '../lib/duration'
import { scoreCourse } from '../lib/score'
import type { Course, LearnerProfile } from '../types'
import { useId } from 'react'

export default function CourseCard({ course, profile, number }: { course: Course; profile: LearnerProfile; number?: number }) {
  const t = (key: string) => translate(key, profile.language)
  const titleId = useId()
  const { score, reasons } = scoreCourse(course, profile)
  const positiveReasons = new Set(['goalMatch', 'levelMatch', 'timeMatch', 'dataMatch', 'costMatch', 'languageMatch']
    .map(key => t('score.' + key)))
  let positiveCount = 0
  const visibleReasons: string[] = []
  const moreReasons: string[] = []
  for (const reason of reasons) {
    if (positiveReasons.has(reason) && ++positiveCount > 2) moreReasons.push(reason)
    else visibleReasons.push(reason)
  }
  const details = [
    ['course.duration', formatDuration(course.hours, profile.language)],
    ['course.cost', course.cost === null ? t('course.unknown') : t('cost.' + course.cost)],
    ['course.data', t('weight.' + course.dataWeight)],
    ['course.language', t('courseLanguage.' + course.language)],
    ['course.level', course.level === null ? t('course.unknown') : t('courseLevel.' + course.level)],
    ['course.verified', course.lastVerified ?? t('course.unknown')],
  ]
  return <li className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    {number !== undefined && <p className="mb-2 text-sm font-bold text-teal-800">{translate('path.step', profile.language, { number })}</p>}
    <h2 id={titleId} className="break-words text-xl font-semibold">{course.title}</h2>
    <p className="mt-1 break-words text-slate-600">{course.provider}</p>
    <a href={course.url} target="_blank" rel="noopener noreferrer" aria-describedby={titleId} className="my-3 inline-flex min-h-11 min-w-11 items-center font-semibold text-teal-800 underline underline-offset-4">{t('course.source')}</a>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      {details.map(([label, value]) => <div key={label}><dt className="text-slate-500">{t(label)}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
    </dl>
    {course.priceNote && <p className="mt-3 text-sm text-slate-600">{course.priceNote}</p>}
    <div className="mt-5 border-t border-slate-100 pt-4">
      <h3 className="font-semibold">{t('course.reasons')}</h3>
      <p className="my-2 text-sm text-teal-800">{translate('course.score', profile.language, { score })}</p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">{visibleReasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
      {moreReasons.length > 0 && <details className="mt-3">
        <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-teal-800">{t('course.moreReasons')}</summary>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">{moreReasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
      </details>}
    </div>
  </li>
}
