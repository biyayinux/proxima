import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMe } from '../../hooks/users/me';
import { base64ToImageSrc } from '../../utils/images/base64Image';
import { formatDateFR } from '../../utils/date';
import MagasinForm from '../../components/articles/addArticle';

export interface Magasin {
  id: number;
  nom: string;
  latitude?: number;
  longitude?: number;
  logo?: string; // Base64 ou URL
  dt?: string; // Date de création
}

function MesMagasins() {
  const { user, loading } = useMe();
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMagasins, setLoadingMagasins] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Titre de la page
  useEffect(() => {
    document.title = `Mes magasins — ${user?.nom || '...'} — Proxima`;
  }, [user]);

  // Récupération des magasins
  useEffect(() => {
    const fetchMagasins = async () => {
      if (!user) return;
      setLoadingMagasins(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Session expirée. Veuillez vous reconnecter.');
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasin/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (!res.ok) setError(data.error || 'Erreur serveur');
        else setMagasins(data.magasins || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les magasins');
      } finally {
        setLoadingMagasins(false);
      }
    };

    fetchMagasins();
  }, [user]);

  const selectedMagasinId = searchParams.get('id');
  const selectedMagasin =
    selectedMagasinId && magasins.length > 0
      ? magasins.find((m) => m.id === Number(selectedMagasinId)) || null
      : null;

  if (loading)
    return (
      <p className="min-h-screen flex items-center justify-center">
        Chargement...
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-black text-black dark:text-white px-4 py-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-6xl mb-6 gap-4">
        <h1 className="text-2xl font-bold">Mes magasins</h1>
        <button
          onClick={() => navigate('/magasin/add')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + Ajouter un magasin
        </button>
      </div>
      <MagasinForm selectedMagasin={selectedMagasin} />
      {loadingMagasins && <p>Chargement des magasins...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {magasins.length === 0 && !loadingMagasins && <p>Aucun magasin trouvé</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
        {magasins.map((magasin) => (
          <div
            key={magasin.id}
            onClick={() => setSearchParams({ id: String(magasin.id) })}
            className="cursor-pointer border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            <img
              src={
                magasin.logo ? base64ToImageSrc(magasin.logo) : '/avatar.png'
              }
              alt={magasin.nom}
              className="w-24 h-24 object-cover rounded"
            />
            <h2 className="font-semibold text-lg">{magasin.nom}</h2>
            {magasin.latitude !== undefined &&
              magasin.longitude !== undefined && (
                <p className="text-sm">
                  Latitude: {magasin.latitude.toFixed(5)}, Longitude:{' '}
                  {magasin.longitude.toFixed(5)}
                </p>
              )}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Créé le {formatDateFR(magasin.dt ?? '')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MesMagasins;
