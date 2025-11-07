import { MapPin, Camera } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        <MapPin className="w-8 h-8 text-white" />
        Proxima
      </h1>
      <p className="max-w-2xl text-center text-gray-200">
        Proxima est une application intelligente dédiée à la géolocalisation du
        magasin le plus proche et à la reconnaissance des articles demandés par
        le client à partir de leur image.
      </p>
      <p className="max-w-2xl text-center text-gray-300">
        Ce projet utilise <strong>React</strong> avec{' '}
        <strong>TypeScript</strong>
        dans un environnement <strong>Vite PWA</strong>, accompagné de
        <strong> TailwindCSS</strong> pour le style.
      </p>
      <div className="flex items-center gap-3 text-gray-100 mt-4">
        <Camera className="w-6 h-6" />
        <span>Reconnaissance d’images intégrée</span>
      </div>
    </div>
  );
}

export default App;
