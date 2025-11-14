import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Search } from 'lucide-react';
import { useMe } from '../../hooks/users/me';
import { base64ToImageSrc } from '../../utils/images/base64Image';
import { toBase64 } from '../../utils/images/imageBase64';
import { formatNumber } from '../../utils/number';

interface QueryResult {
  article_id: number;
  article_name: string;
  price: number;
  devise: string;
  photos: string[];
  similarity: number;
  distance_km?: number;
  store: {
    id: number;
    name: string;
    latitude?: number;
    longitude?: number;
    logo?: string;
  };
}

export default function RechercheImage() {
  const { user } = useMe();
  const navigate = useNavigate();
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = `Recherche par image — ${user?.nom || 'Proxima'}`;
  }, [user]);

  // Récupération position GPS
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      () => console.warn('Localisation non autorisée'),
    );
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const base64 = await toBase64(file);
      setPhotoBase64(base64 as string);
    }
  };

  const handleSearch = async () => {
    if (!photoBase64) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/search/searchPhoto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ photo: photoBase64, latitude, longitude }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la recherche');

      setResults(data.data?.query_results || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur interne');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreClick = (storeId: number) => {
    navigate(`/magasin/detail/${storeId}`);
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-4">Recherche par image</h1>
        <div
          className="w-40 h-40 border border-gray-400 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="aperçu"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ImagePlus size={40} />
              <p className="text-sm mt-2">Choisir une image</p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !photoBase64}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-700
          bg-black text-white dark:bg-white dark:text-black hover:opacity-80
          transition disabled:opacity-50"
        >
          <Search size={18} />
          {loading ? 'Recherche en cours...' : 'Rechercher'}
        </button>
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {results.map((r) => (
          <div
            key={r.article_id}
            className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center gap-3 bg-gray-50 dark:bg-gray-900 hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={
                r.photos?.[0]
                  ? base64ToImageSrc(r.photos[0])
                  : r.store?.logo
                    ? base64ToImageSrc(r.store.logo)
                    : '/avatar.png'
              }
              alt={r.article_name}
              className="w-28 h-28 object-cover rounded-md"
            />
            <h2 className="font-semibold text-lg text-center">
              {r.article_name}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {formatNumber(r.price)} {r.devise}
            </p>
            {r.store && (
              <div
                onClick={() => handleStoreClick(r.store.id)}
                className="flex flex-col items-center text-center text-xs text-gray-500 cursor-pointer hover:opacity-80 transition"
              >
                <img
                  src={
                    r.store.logo
                      ? base64ToImageSrc(r.store.logo)
                      : '/store-default.png'
                  }
                  alt={r.store.name}
                  className="w-10 h-10 object-cover rounded-full mb-1"
                />
                <p>{r.store.name}</p>
                <p>
                  {r.distance_km
                    ? `${r.distance_km.toFixed(1)} km`
                    : 'Distance inconnue'}
                </p>
              </div>
            )}
            <div className="text-xs text-gray-400 text-center mt-2">
              <p>Similarité {(r.similarity * 100).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
      {!loading && results.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-10">
          Aucune recherche effectuée
        </p>
      )}
    </div>
  );
}
