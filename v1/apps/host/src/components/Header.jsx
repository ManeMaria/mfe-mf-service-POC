export default function Header() {
  return (
    <header className="h-16 bg-slate-900 text-white flex items-center px-6 shadow">
      <span className="text-xl font-bold">MFE POC</span>
      <nav className="ml-8 flex gap-6 text-sm">
        <a href="/" className="hover:text-sky-300">Home</a>
        <a href="/app1/" className="hover:text-sky-300">app1 (Vite)</a>
        <a href="/app2/" className="hover:text-sky-300">app2 (Webpack)</a>
      </nav>
    </header>
  )
}
