
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function QuickLinks({ links, loading }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {links.map((item) => (
        <div key={item.id} className="relative group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4 transition-all hover:border-[var(--primary)] hover:shadow-md">
          <Link
            to={item.path}
            tabIndex={0}
            aria-label={item.label}
            className="flex items-center gap-3 flex-1"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg)] text-lg text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
              {item.icon}
            </span>
            <span className="font-semibold text-[var(--text)] group-hover:text-[var(--primary)]">
              {item.label}
            </span>
          </Link>
          <button
            type="button"
            aria-label={isFavorite(item.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className={`absolute top-2 right-2 text-xl transition ${isFavorite(item.id) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
            onClick={() => toggleFavorite(item.id)}
            tabIndex={0}
          >
            ★
          </button>
        </div>
      ))}
    </div>
  );
}
