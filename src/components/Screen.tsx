import { translate } from '../i18n'
import type { ScreenId } from '../lib/routes'

export default function Screen({ id }: { id: ScreenId }) {
  return (
    <main id="main" data-screen={id} className="min-h-64 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{translate(`screens.${id}.title`)}</h1>
    </main>
  )
}
