import { version } from 'react'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-600 text-white">
      <h1 style={{ fontSize: '52px' }} className="font-bold">
        app2 — React + Webpack
      </h1>
      <p className="mt-4 text-lg opacity-90">React v{version}</p>
    </div>
  )
}
