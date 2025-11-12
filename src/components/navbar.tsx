import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/theme';
import { useState } from 'react';
import { Menu, X, Sun, Moon, Home, User, Store, Search } from 'lucide-react';

function Navbar() {
  const { theme, handleToggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const linkClass = (path: string) =>
    `flex items-center gap-2 hover:underline ${
      location.pathname === path ? 'underline' : ''
    }`;

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Proxima
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/all" className={linkClass('/')}>
            <Home size={18} /> Accueil
          </Link>
          <Link to="/search" className={linkClass('/search')}>
            <Search size={18} /> Recherche
          </Link>
          <Link to="/magasin" className={linkClass('/magasin')}>
            <Store size={18} /> Magasin
          </Link>
          <Link to="/profile" className={linkClass('/profile')}>
            <User size={18} /> Profil
          </Link>
          <button
            onClick={handleToggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Clair' : 'Sombre'}
          </button>
        </div>
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 border-t border-gray-200 dark:border-gray-800">
          <Link to="/" onClick={closeMenu} className={linkClass('/')}>
            <Home size={18} /> Accueil
          </Link>
          <Link
            to="/search"
            onClick={closeMenu}
            className={linkClass('/search')}
          >
            <Search size={18} /> Recherche
          </Link>
          <Link
            to="/magasin"
            onClick={closeMenu}
            className={linkClass('/magasin')}
          >
            <Store size={18} /> Magasin
          </Link>
          <Link
            to="/profile"
            onClick={closeMenu}
            className={linkClass('/profile')}
          >
            <User size={18} /> Profil
          </Link>
          <button
            onClick={() => {
              handleToggleTheme();
              closeMenu();
            }}
            className="flex items-center gap-2 px-3 py-1.5 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Clair' : 'Sombre'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
