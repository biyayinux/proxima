import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import GetMagasinArticlesUser from '../../components/articles/getMagasinArticlesUser';
import type { Article } from '../../hooks/typages/getIdMagasinUser';
import { base64ToImageSrc } from '../../utils/images/base64Image';
import { formatDateFR } from '../../utils/date';

interface Magasin {
  id: number;
  nom: string;
  logo?: string;
  latitude: number;
  longitude: number;
  dt: string;
}

interface MagasinData {
  magasin: Magasin;
  articles: Article[];
  total_articles: number;
}

export default function MagasinPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<MagasinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMagasin = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Session expirée. Veuillez vous reconnecter');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasins/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Erreur serveur');
        } else {
          // Json doit respecter { magasin, articles, total_articles }
          setData(json as MagasinData);
          document.title = `Magasin — ${json.magasin?.nom || '...'} — Proxima`;
        }
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer le magasin');
      } finally {
        setLoading(false);
      }
    };

    fetchMagasin();
  }, [id]);

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {data && (
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 mb-6">
          <img
            src={
              data.magasin.logo
                ? base64ToImageSrc(data.magasin.logo)
                : '/avatar.png'
            }
            alt={data.magasin.nom}
            className="w-32 h-32 object-cover rounded-full border border-gray-300 dark:border-gray-700"
          />
          <h1 className="text-3xl font-bold text-center">{data.magasin.nom}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Latitude {data.magasin.latitude}, Longitude {data.magasin.longitude}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Créé le {formatDateFR(data.magasin.dt)}
          </p>
          <div className="w-full flex justify-center">
            <button
              onClick={() => navigate(`/magasin/article/add/${id}`)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-opacity duration-200"
            >
              <Plus size={16} />
              Ajouter un article
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
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
        data?.articles && <GetMagasinArticlesUser articles={data.articles} />
      )}
    </div>
  );
}
