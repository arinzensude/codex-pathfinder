import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { translate } from '../i18n'
import { validHours, type ProfileDraft } from '../lib/profile'
import type { Goal } from '../types'
import Choices from './Choices'
export const steps = ['welcome', 'goal', 'why', 'constraints'] as const
export default function Onboarding({ step, profile, update, goals }: {
  step: typeof steps[number]; profile: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void; goals: Goal[]
}) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const t = (key: string) => translate(key, profile.language)
  const index = steps.indexOf(step)
  function next() {
    if (step === 'goal' && !goals.includes(profile.goal as Goal)) { setError('errors.goal'); return }
    if (step === 'why' && !profile.why.trim()) { setError('errors.why'); return }
    if (step === 'constraints' && !validHours(profile.hoursPerWeek)) { setError('errors.hours'); return }
    setError('')
    navigate(index === 3 ? '/path' : '/' + steps[index + 1])
  }
  return <main id="main" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
    <h1 tabIndex={-1} className="text-2xl font-bold tracking-tight outline-none">{t('screens.' + step + '.title')}</h1>
    <p className="mb-7 mt-3 leading-relaxed text-slate-600">{t('screens.' + step + '.description')}</p>
    <form noValidate onSubmit={event => { event.preventDefault(); next() }} className="space-y-6">
      {step === 'welcome' && <div className="rounded-xl bg-teal-50 p-4 leading-relaxed text-teal-900">{t('welcome.note')}</div>}
      {step === 'goal' && <>
        <Choices name="goal" label={t('goal.label')} options={goals} value={profile.goal} onChange={goal => update({ goal })} text={goal => t('goals.' + goal)} />
        <Choices name="level" label={t('level.label')} options={['new', 'basics', 'intermediate'] as const} value={profile.level} onChange={level => update({ level })} text={level => t('levels.' + level)} />
      </>}
      {step === 'why' && <div>
        <label htmlFor="why" className="mb-3 block font-semibold">{t('why.label')}</label>
        <textarea id="why" rows={5} value={profile.why} onChange={event => update({ why: event.target.value })} placeholder={t('why.placeholder')} aria-invalid={error === 'errors.why'} aria-describedby={error ? 'form-error' : undefined} className="w-full resize-y rounded-xl border border-slate-300 p-3" />
      </div>}
      {step === 'constraints' && <>
        <div><label htmlFor="hours" className="mb-3 block font-semibold">{t('constraints.hours')}</label>
          <input id="hours" type="number" min="0.5" max="168" step="0.5" value={Number.isNaN(profile.hoursPerWeek) ? '' : profile.hoursPerWeek} onChange={event => update({ hoursPerWeek: event.target.valueAsNumber })} aria-invalid={error === 'errors.hours'} aria-describedby={error === 'errors.hours' ? 'hours-hint form-error' : 'hours-hint'} className="min-h-12 w-full rounded-xl border border-slate-300 p-3" />
          <p id="hours-hint" className="mt-2 text-sm text-slate-600">{t('constraints.hoursHint')}</p>
        </div>
        <Choices name="device" label={t('constraints.device')} options={['phone', 'laptop'] as const} value={profile.device} onChange={device => update({ device })} text={value => t('devices.' + value)} />
        <Choices name="data" label={t('constraints.data')} options={['very_limited', 'some', 'plenty'] as const} value={profile.data} onChange={data => update({ data })} text={value => t('data.' + value)} />
        <Choices name="budget" label={t('constraints.budget')} options={['free_only', 'can_pay'] as const} value={profile.budget} onChange={budget => update({ budget })} text={value => t('budget.' + value)} />
      </>}
      <div id="form-error" role={error ? 'alert' : undefined} className="text-sm font-medium text-red-700">{error && t(error)}</div>
      <div className="flex gap-3 border-t border-slate-100 pt-5">
        {index > 0 && <button type="button" onClick={() => navigate(index === 1 ? '/' : '/' + steps[index - 1])} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold">{t('actions.back')}</button>}
        <button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">{t(step === 'welcome' ? 'actions.start' : step === 'constraints' ? 'actions.finish' : 'actions.continue')}</button>
      </div>
    </form>
  </main>
}

