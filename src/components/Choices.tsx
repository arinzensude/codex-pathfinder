interface Props<T extends string> {
  name: string; label: string; options: readonly T[]; value: T | ''
  onChange: (value: T) => void; text: (value: T) => string
  errorId?: string
}
export default function Choices<T extends string>({ name, label, options, value, onChange, text, errorId }: Props<T>) {
  return <fieldset aria-describedby={errorId} aria-invalid={!!errorId} className="min-w-0 space-y-3">
    <legend className="mb-3 font-semibold">{label}</legend>
    {options.map(option => <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700 ${value === option ? 'border-teal-700 bg-teal-50' : 'border-slate-200'}`}>
      <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} className="size-5 shrink-0 accent-teal-700" />
      <span>{text(option)}</span>
    </label>)}
  </fieldset>
}

