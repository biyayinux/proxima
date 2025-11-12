import { useTheme } from '../utils/theme';
import { Sun, Moon } from 'lucide-react';

function MobileHeader() {
  const { theme, handleToggleTheme } = useTheme();

  return (
    <header
      className={`md:hidden w-full border-b transition-colors duration-300
        ${theme === 'dark' ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-black'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <img
          src="/images/icons/logo.png"
          alt="Proxima"
          className="h-8 w-auto"
        />
        <button
          onClick={handleToggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 border rounded transition
            ${
              theme === 'dark'
                ? 'border-gray-700 hover:bg-gray-900 text-white'
                : 'border-gray-300 hover:bg-gray-100 text-black'
            }`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm">
            {theme === 'dark' ? 'Clair' : 'Sombre'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default MobileHeader;
