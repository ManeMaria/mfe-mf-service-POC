import { version } from 'react'
import Header from 'host/Header'
import Sidebar from 'host/Sidebar'

export default function App() {
  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-sky-600 text-white">
          <h1 style={{ fontSize: '52px' }} className="font-bold">
            app1 — React + Vite
          </h1>
          <p className="mt-4 text-lg opacity-90">React v{version}</p>
        </div>
      </div>
    </>
  )
}
