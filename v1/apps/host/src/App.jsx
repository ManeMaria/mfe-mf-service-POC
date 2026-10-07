import { version } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-white">
          <h1 style={{ fontSize: '52px' }} className="font-bold text-slate-800">
            host — shell
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            React v{version}. Dono do layout (header/nav + sidebar).
          </p>
          <div className="mt-8 p-6 rounded-lg border border-dashed border-slate-300 bg-slate-50">
            <p className="text-slate-500">
              Área de conteúdo. Na Fase 1, use o menu para abrir{' '}
              <a href="/app1/" className="text-sky-600 underline">app1</a> ou{' '}
              <a href="/app2/" className="text-emerald-600 underline">app2</a>.
              Na Fase 2, os remotes serão carregados aqui via Module Federation.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
