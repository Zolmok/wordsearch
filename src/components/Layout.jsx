import { Link, useRouterState } from '@tanstack/react-router';

export default function Layout({ children }) {
  const { location } = useRouterState();
  const isGame = location.pathname === '/game';

  return (
    <div className="min-h-screen flex flex-col">
      {!isGame && (
        <header className="border-b border-border-glow px-6 py-4">
          <nav className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold glow-text no-underline">
              Word Search
            </Link>
            <div className="flex gap-4">
              <Link
                to="/"
                className="text-text-dim hover:text-cyan transition-colors no-underline"
              >
                Home
              </Link>
              <Link
                to="/scores"
                className="text-text-dim hover:text-cyan transition-colors no-underline"
              >
                Scores
              </Link>
            </div>
          </nav>
        </header>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
