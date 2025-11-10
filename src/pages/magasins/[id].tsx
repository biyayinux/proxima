import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base64ToImageSrc } from '../../utils/images/base64Image';
import { formatDateFR } from '../../utils/date';
import { useMe } from '../../hooks/users/me';

interface Magasin {
  id: number;
  nom: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  dt?: string;
}

function MagasinDetail() {
  const { id } = useParams();
  const { user } = useMe(); // Récupère l'utilisateur connecté
  const [magasin, setMagasin] = useState<Magasin | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mettre à jour le titre de la page
  useEffect(() => {
    if (magasin || user) {
      document.title = `${magasin?.nom || '...'} — ${user?.nom || '...'} — Proxima`;
    }
  }, [magasin, user]);

  // Charger les détails du magasin
  useEffect(() => {
    const fetchMagasin = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasin/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (!res.ok) setError(data.error || 'Erreur serveur');
        else setMagasin(data.magasin);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le magasin');
      } finally {
        setLoading(false);
      }
    };

    fetchMagasin();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!magasin)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Aucun magasin trouvé</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-black text-black dark:text-white p-6">
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center max-w-md w-full">
        <img
          src={magasin.logo ? base64ToImageSrc(magasin.logo) : '/avatar.png'}
          alt={magasin.nom}
          className="w-32 h-32 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{magasin.nom}</h1>
        {magasin.latitude && magasin.longitude && (
          <p className="text-sm mb-2">
            {magasin.latitude.toFixed(5)}, {magasin.longitude.toFixed(5)}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400">
          Créé le {formatDateFR(magasin.dt ?? '')}
        </p>
      </div>
    </div>
  );
}

export default MagasinDetail;
