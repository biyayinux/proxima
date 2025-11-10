import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import GetMagasinsUser from '../../components/magasins/getMagasinsUser';
import type { Magasin } from '../../hooks/typages/getMagasinsUser';
import { useMe } from '../../hooks/users/me';
import { formatNumber } from '../../utils/number';

export default function getMagasinsUser() {
  const { user } = useMe();
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mise à jour du titre de l'onglet dynamiquement
  useEffect(() => {
    document.title = `Magasins — ${user?.nom || `...`} — Proxima`;
  }, [user]);

  // Récupération des magasins
  useEffect(() => {
    if (!user) return;

    const fetchMagasins = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Session expirée. Veuillez vous reconnecter.');
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasins/getMagasinsUser`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = await res.json();
        if (!res.ok) setError(data.error || 'Erreur serveur');
        else setMagasins(data.magasins || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les magasins');
      } finally {
        setLoading(false);
      }
    };

    fetchMagasins();
  }, [user]);

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-6 gap-4">
        <h1 className="text-2xl font-bold">
          {magasins.length === 0
            ? ' '
            : magasins.length === 1
              ? `${formatNumber(magasins.length)} magasin`
              : `${formatNumber(magasins.length)} magasins`}
        </h1>
        <button
          onClick={() => navigate('/magasin/add')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
         bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
        >
          <Plus size={18} />
          Ajouter un magasin
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col gap-3"
            >
              <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-xl" />
              <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <GetMagasinsUser magasins={magasins} />
      )}
    </div>
  );
}
