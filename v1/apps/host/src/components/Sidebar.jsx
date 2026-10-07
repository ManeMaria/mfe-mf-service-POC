export default function Sidebar() {
  return (
    <aside className="w-56 bg-slate-100 border-r border-slate-200 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
        Apps
      </h2>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="/app1/" className="block px-3 py-2 rounded hover:bg-sky-100 text-slate-700">
            app1 — React 19 + Vite
          </a>
        </li>
        <li>
          <a href="/app2/" className="block px-3 py-2 rounded hover:bg-emerald-100 text-slate-700">
            app2 — React 18 + Webpack
          </a>
        </li>
      </ul>
    </aside>
  )
}
