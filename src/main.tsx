import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PageRenderer } from './page-builder/PageRenderer'
import { validatePageSpec } from './page-builder/validatePageSpec'
import './index.css'

const pageModules = import.meta.glob('../generated-pages/*.json', { eager: true, import: 'default' }) as Record<string, unknown>
const pageName = new URLSearchParams(window.location.search).get('page')

function renderPreviewError(errors: string[]) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8 text-white">
      <div className="w-full max-w-3xl rounded-2xl border border-red-400/30 bg-red-950/30 p-8">
        <h1 className="text-2xl font-semibold">PageSpec validation failed</h1>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-red-100">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      </div>
    </div>
  )
}

let content = <App />

if (pageName) {
  const modulePath = `../generated-pages/${pageName}.json`
  const pageModule = pageModules[modulePath]
  const result = pageModule ? validatePageSpec(pageModule) : { ok: false as const, errors: [`Page ${pageName} was not found`] }
  content = result.ok ? <PageRenderer spec={result.spec} /> : renderPreviewError(result.errors)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {content}
  </React.StrictMode>,
)
