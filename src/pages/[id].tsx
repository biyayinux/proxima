import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base64ToImageSrc } from '../utils/images/base64Image';
import { formatNumber } from '../utils/number';
import { Store, Package, User, Phone } from 'lucide-react';

interface Article {
  id: number;
  nom: string;
  prix: number;
  devise: string;
  photo_article?: string | null;
}

interface Magasin {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  logo?: string | null;
  proprietaire_nom?: string;
  proprietaire_telephone?: string;
  proprietaire_photo?: string | null;
}

export default function MagasinDetail() {
  const { id } = useParams();
  const [magasin, setMagasin] = useState<Magasin | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMagasin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMagasin = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token)
        throw new Error('Session expirée. Veuillez vous reconnecter.');

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasins/detail/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement');

      setMagasin(data.magasin);
      setArticles(data.articles || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 animate-pulse">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {magasin && (
          <div className="flex flex-col items-center gap-4 mb-10 border p-5 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-md">
            <img
              src={
                magasin.logo ? base64ToImageSrc(magasin.logo) : '/avatar.png'
              }
              alt={magasin.nom}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-md"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-center">
              {magasin.nom}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Store size={18} />
                <span className="text-sm sm:text-base">
                  {magasin.latitude}, {magasin.longitude}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User size={18} />
                <span className="text-sm sm:text-base">
                  {magasin.proprietaire_nom}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={18} />
                <span className="text-sm sm:text-base">
                  {magasin.proprietaire_telephone}
                </span>
              </div>
            </div>
          </div>
        )}
        <section>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <Package size={24} />
            Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div
                key={a.id}
                className="border rounded-2xl p-4 flex flex-col items-center gap-3 bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={
                    a.photo_article
                      ? base64ToImageSrc(a.photo_article)
                      : '/avatar.png'
                  }
                  alt={a.nom}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md"
                />
                <h4 className="font-semibold text-lg text-center">{a.nom}</h4>
                <p className="text-sm font-medium">
                  {formatNumber(a.prix)} {a.devise}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
