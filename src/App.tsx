import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Screen from './components/Screen'
import { screens } from './lib/routes'
import { translate } from './i18n'

export default function App() {
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      <nav aria-label={translate('navigation.label') || undefined} className="grid grid-cols-6 gap-2">
        {screens.map((screen, index) => (
          <NavLink key={screen.id} to={screen.path} end
            aria-label={translate(`screens.${screen.id}.title`) || undefined}
            className={({ isActive }) => `flex min-h-11 min-w-11 items-center justify-center rounded-lg ${isActive ? 'bg-teal-700 text-white' : 'bg-white text-slate-700'}`}>
            {index + 1}
          </NavLink>
        ))}
      </nav>
      <Routes>
        {screens.map(screen => <Route key={screen.id} path={screen.path} element={<Screen id={screen.id} />} />)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
