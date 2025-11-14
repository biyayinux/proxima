import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { base64ToImageSrc } from '../utils/images/base64Image';
import { formatNumber } from '../utils/number';

import { Store, Package, User } from 'lucide-react';

interface Magasin {
  id: number;
  nom: string;
  logo?: string | null;
  utilisateur_nom?: string | null;
  utilisateur_photo_profil?: string | null;
}

interface Article {
  id: number;
  nom: string;
  prix: number;
  devise: string;
  photo_article?: string | null;
  magasin_logo?: string | null;
  utilisateur_photo_profil?: string | null;
}

export default function AllData() {
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Accueil — Proxima';
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token)
        throw new Error('Session expirée. Veuillez vous reconnecter.');

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/getAll`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement');

      setMagasins(data.magasins || []);
      setArticles(data.articles || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Chargement...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">
        Erreur {error}
      </p>
    );

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Magasins</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {magasins.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/magasin/detail/${m.id}`)}
                className="cursor-pointer border border-gray-300 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center gap-3 
                           bg-gray-50 dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={m.logo ? base64ToImageSrc(m.logo) : '/avatar.png'}
                  alt={m.nom}
                  className="w-24 h-24 object-cover rounded-xl shadow-md"
                />
                <h3 className="font-semibold text-lg mt-2">{m.nom}</h3>
                <div className="flex flex-col items-center text-xs text-gray-500 mt-3">
                  <img
                    src={
                      m.utilisateur_photo_profil
                        ? base64ToImageSrc(m.utilisateur_photo_profil)
                        : '/avatar.png'
                    }
                    alt={m.utilisateur_nom || 'Propriétaire'}
                    className="w-10 h-10 object-cover rounded-full mb-1 border border-gray-300"
                  />
                  <p className="text-sm flex items-center gap-1">
                    <User size={14} />
                    {m.utilisateur_nom}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Articles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => {
              const articlePhoto = a.photo_article
                ? base64ToImageSrc(a.photo_article)
                : '/avatar.png';

              const magasinLogo = a.magasin_logo
                ? base64ToImageSrc(a.magasin_logo)
                : '/avatar.png';

              const proprietairePhoto = a.utilisateur_photo_profil
                ? base64ToImageSrc(a.utilisateur_photo_profil)
                : '/avatar.png';

              return (
                <div
                  key={a.id}
                  className="border border-gray-300 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center gap-3 
                             bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={articlePhoto}
                    alt={a.nom}
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <h3 className="font-semibold text-lg text-center">{a.nom}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {formatNumber(a.prix)} {a.devise}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={magasinLogo}
                      alt="Logo magasin"
                      className="w-10 h-10 object-cover rounded-xl border border-gray-300"
                    />
                    <img
                      src={proprietairePhoto}
                      alt="Propriétaire"
                      className="w-10 h-10 object-cover rounded-full border border-gray-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
