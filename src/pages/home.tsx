import { useTheme } from '../utils/theme';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const { theme, handleToggleTheme } = useTheme();

  useEffect(() => {
    document.title = 'Accueil — Proxima';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur Proxima</h1>
      <p className="max-w-xl text-center mb-10 px-4">
        <strong>Proxima</strong> est une application intelligente dédiée à la
        géolocalisation du magasin le plus proche et à la reconnaissance des
        articles demandés par le client à partir de leur image.
        <br />
        Ce projet utilise <strong>React</strong> avec{' '}
        <strong>TypeScript</strong> dans un environnement{' '}
        <strong>Vite PWA</strong>, accompagné de <strong>TailwindCSS</strong>{' '}
        pour le style.
      </p>
      <div className="flex gap-4">
        <Link
          to="/signUp"
          className="px-4 py-2 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          S'inscrire
        </Link>
        <button
          onClick={handleToggleTheme}
          className="px-4 py-2 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          Mode {theme === 'dark' ? 'clair' : 'sombre'}
        </button>
      </div>
    </div>
  );
}

export default Home;
