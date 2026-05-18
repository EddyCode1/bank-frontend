
import { useMemo } from 'react';
import { useFavorites } from '../../dashboard/hooks/useFavorites';
import { Link } from 'react-router-dom';

// Debe coincidir con los quickLinksBase del dashboard
const quickLinksBase = [
  { id: 1, label: 'Cuentas',         path: '/loby/account',       icon: '◉' },
  { id: 2, label: 'Favoritos',      path: '/loby/favorites',     icon: '★' },
  { id: 3, label: 'Productos',      path: '/loby/products',      icon: '◫' },
  { id: 4, label: 'Servicios',      path: '/loby/services',      icon: '◌' },
  { id: 5, label: 'Transacciones',  path: '/loby/transactions',  icon: '⇄' },
];

export default function FavoritePage() {
  const { favorites, toggleFavorite } = useFavorites();
  const favLinks = useMemo(() => quickLinksBase.filter(l => favorites.includes(l.id)), [favorites]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Tus favoritos</h1>
      <p className="mt-2 text-gray-600">Accesos rápidos marcados como favoritos en este navegador.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favLinks.length === 0 && (
          <div className="col-span-full text-center text-[var(--muted)] py-8">No tienes favoritos aún. Marca accesos rápidos en el dashboard.</div>
        )}
        {favLinks.map((item) => (
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
              aria-label="Quitar de favoritos"
              className="absolute top-2 right-2 text-xl text-yellow-400 hover:text-gray-300 transition"
              onClick={() => toggleFavorite(item.id)}
              tabIndex={0}
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
