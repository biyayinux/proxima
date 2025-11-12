import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/theme';
import { Sun, Moon, Home, User, Store, Search } from 'lucide-react';

function Navbar() {
  const { theme, handleToggleTheme } = useTheme();
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex flex-col items-center justify-center text-xs md:text-sm gap-1 md:gap-2 hover:text-blue-500 ${
      location.pathname === path ? 'text-blue-600 font-semibold' : ''
    }`;

  return (
    <>
      <nav className="hidden md:flex w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/images/icons/logo.png"
            alt="Proxima"
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-6">
            <Link to="/all" className={linkClass('/')}>
              <Home size={18} /> Accueil
            </Link>
            <Link to="/profile" className={linkClass('/profile')}>
              <User size={18} /> Profil
            </Link>
            <Link to="/magasin" className={linkClass('/magasin')}>
              <Store size={18} /> Magasin
            </Link>
            <Link to="/search" className={linkClass('/search')}>
              <Search size={18} /> Recherche
            </Link>
            <button
              onClick={handleToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Clair' : 'Sombre'}
            </button>
          </div>
        </div>
      </nav>
      <nav className="fixed bottom-0 left-0 w-full md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <div className="flex justify-around items-center py-2">
          <Link to="/all" className={linkClass('/')}>
            <Home size={20} />
            <span>Accueil</span>
          </Link>
          <Link to="/profile" className={linkClass('/profile')}>
            <User size={20} />
            <span>Profil</span>
          </Link>
          <Link to="/magasin" className={linkClass('/magasin')}>
            <Store size={20} />
            <span>Magasin</span>
          </Link>
          <Link to="/search" className={linkClass('/search')}>
            <Search size={20} />
            <span>Recherche</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
