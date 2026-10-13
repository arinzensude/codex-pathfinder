import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Onboarding, { steps } from './components/Onboarding'
import PathScreen from './components/PathScreen'
import catalog from './data/catalog.json'
import { translate } from './i18n'
import { catalogGoals, initialProfile, type ProfileDraft } from './lib/profile'
import { screens } from './lib/routes'
import type { Course } from './types'
import { buildPath } from './lib/score'
import { completeProfile, loadSavedPath, savePath } from './lib/storage'
import { loadLanguage, saveLanguage } from './lib/language'

export default function App({ courses = catalog as Course[] }: { courses?: Course[] }) {
  const [startupSaved] = useState(loadSavedPath)
  const [saved, setSaved] = useState(startupSaved)
  const [profile, setProfile] = useState<ProfileDraft>(() => ({
    ...(startupSaved?.profile ?? initialProfile),
    language: loadLanguage() ?? startupSaved?.profile.language ?? initialProfile.language,
  }))
  const [languageError, setLanguageError] = useState(false)
  const [saveError, setSaveError] = useState('')
  const navigate = useNavigate()
  const restored = useRef(false)
  const goals = useMemo(() => catalogGoals(courses), [courses])
  const path = useMemo(() => completeProfile(profile) ? buildPath(courses, profile) : [], [courses, profile])
  const { pathname } = useLocation()
  const stepIndex = screens.findIndex(screen => screen.path === pathname)
  const t = (key: string) => translate(key, profile.language)
  const update = (patch: Partial<ProfileDraft>) => {
    setProfile(current => ({ ...current, ...patch }))
    if (patch.language) {
      try { saveLanguage(patch.language); setLanguageError(false) }
      catch { setLanguageError(true) }
    }
    if (patch.language && saved) {
      try {
        setSaved(savePath({ ...saved.profile, language: patch.language }, saved.path))
        setSaveError('')
      } catch { setSaveError('saved.error') }
    }
  }
  function save() {
    if (!completeProfile(profile) || path.length === 0) return
    try {
      setSaved(savePath(profile, path))
      setSaveError('')
      navigate('/saved')
    } catch { setSaveError('saved.error') }
  }
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    if (startupSaved) navigate('/saved', { replace: true })
  }, [startupSaved, navigate])
  useEffect(() => {
    document.documentElement.lang = profile.language
    document.title = translate('app.name', profile.language)
  }, [profile.language])
  useEffect(() => { document.querySelector<HTMLElement>('h1')?.focus() }, [pathname])
  const progress = translate('progress.step', profile.language, { current: stepIndex + 1, total: 4 })
  return <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <span className="text-xl font-bold tracking-tight text-teal-800">{t('app.name')}</span>
      <div role="group" aria-label={t('language.label')} className="flex rounded-xl border border-slate-300 bg-white p-1">
        {(['en', 'fr'] as const).map(language => <button type="button" key={language} aria-pressed={profile.language === language} onClick={() => update({ language })} className={`min-h-11 rounded-lg px-3 text-sm font-semibold ${profile.language === language ? 'bg-teal-700 text-white' : 'text-slate-700'}`}>{t('language.' + language)}</button>)}
      </div>
    </header>
    {languageError && <p role="alert" className="mb-4 text-sm text-red-700">{t('language.saveError')}</p>}
    {stepIndex >= 0 && stepIndex < 4 && <div className="mb-6">
      <p className="mb-2 text-sm font-medium text-slate-600">{progress}</p>
      <div role="progressbar" aria-label={t('progress.label')} aria-valuemin={0} aria-valuemax={4} aria-valuenow={stepIndex + 1} aria-valuetext={progress} className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-teal-700 transition-all motion-reduce:transition-none" style={{ width: `${(stepIndex + 1) * 25}%` }} />
      </div>
    </div>}
    <Routes>
      {steps.map((step, index) => <Route key={step} path={screens[index].path} element={
        index > 1 && !profile.goal ? <Navigate to="/goal" replace /> :
        index > 2 && !profile.why.trim() ? <Navigate to="/why" replace /> :
        <Onboarding key={step} step={step} profile={profile} update={update} goals={goals} />
      } />)}
      <Route path="/path" element={completeProfile(profile)
        ? <PathScreen profile={profile} path={path} onSave={save} error={saveError} />
        : <Navigate to={profile.goal ? '/constraints' : '/goal'} replace />} />
      <Route path="/saved" element={saved
        ? <PathScreen profile={{ ...saved.profile, language: profile.language }} path={saved.path} saved error={saveError} />
        : <Navigate to={completeProfile(profile) ? '/path' : '/'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
}
