import { Link } from 'react-router-dom'
import { translate } from '../i18n'
import type { Course, LearnerProfile } from '../types'
import CourseCard from './CourseCard'

export default function PathScreen({ profile, path, refreshers = [], saved = false, onSave, error = '' }: {
  profile: LearnerProfile; path: Course[]; saved?: boolean; onSave?: () => void; error?: string
  refreshers?: Course[]
}) {
  const t = (key: string) => translate(key, profile.language)
  return <main id="main" className="space-y-5">
    <h1 tabIndex={-1} className="text-2xl font-bold outline-none">{t(saved ? 'screens.saved.title' : 'screens.path.title')}</h1>
    {saved && <p role="status" className="rounded-xl bg-teal-50 p-4 font-semibold text-teal-900">{t('saved.confirmation')}</p>}
    <aside aria-label={t('path.why')} className="sticky top-0 z-10 rounded-xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-teal-800">{t('path.why')}</h2>
      <p className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-teal-950">{profile.why}</p>
    </aside>
    {path.length > 0 && <p className="text-sm leading-relaxed text-slate-600">{t('path.ordering')}</p>}
    {path.length > 0 && path.length < 3 && <p role="status" className="text-sm text-slate-600">{t('path.shortage')}</p>}
    {path.length > 0 ? <ol className="space-y-5" aria-label={t('path.courses')}>{path.map((course, index) => <CourseCard key={course.id} course={course} profile={profile} number={index + 1} />)}</ol> :
      <p role="status" className="rounded-xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-600">{t('path.empty')}</p>}
    {([['path.refreshers', refreshers]] as const).map(([label, courses]) => courses.length > 0 &&
      <details key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="min-h-11 cursor-pointer content-center font-semibold">{t(label)} ({courses.length})</summary>
        <ul aria-label={t(label)} className="mt-4 space-y-4">{courses.map(course => <CourseCard key={course.id} course={course} profile={profile} />)}</ul>
      </details>)}
    {saved && path[0] && <section className="rounded-2xl border border-dashed border-teal-600 bg-white p-5">
      <h2 className="font-semibold text-teal-800">{t('saved.comingNext')}</h2>
      <p className="mb-3 mt-1 text-sm text-slate-500">{t('saved.preview')}</p>
      <blockquote className="break-words leading-relaxed">{translate('saved.nudge', profile.language, { why: profile.why, course: path[0].title })}</blockquote>
    </section>}
    <p className="text-sm text-slate-500">{t('saved.sourceOffline')}</p>
    {error && <p role="alert" className="text-sm text-red-700">{t(error)}</p>}
    <div className="flex flex-wrap gap-3">
      <Link to="/constraints" className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-5 font-semibold">{t(saved ? 'actions.edit' : 'actions.back')}</Link>
      {!saved && path.length + refreshers.length > 0 && <button type="button" onClick={onSave} className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">{t('actions.save')}</button>}
    </div>
  </main>
}
