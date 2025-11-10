import { useEffect, useState } from 'react';
import type { Magasin } from '../../pages/magasins/index';
import { toBase64 } from '../../utils/images/imageBase64';

interface Props {
  selectedMagasin: Magasin | null;
}

const UseAddArticle: React.FC<Props> = ({ selectedMagasin }) => {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [devise, setDevise] = useState<'CDF' | 'USD'>('CDF');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Réinitialise le formulaire quand le magasin change
  useEffect(() => {
    setNom('');
    setPrix('');
    setDevise('CDF');
    setImage(null);
    setPreview(null);
    setMessage(null);
  }, [selectedMagasin]);

  const handleImageClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMagasin) return;
    if (!nom || !prix || !image) {
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const base64Image = (await toBase64(image)) as string;
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/articles/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_magasin: selectedMagasin.id,
            nom,
            prix: Number(prix),
            devise,
            photos: [base64Image],
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      setMessage('Article ajouté avec succès');
      setNom('');
      setPrix('');
      setDevise('CDF');
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      setMessage(err.message || 'Erreur lors de l’ajout');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedMagasin) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mb-6 p-4 border border-black dark:border-white rounded bg-white dark:bg-black text-black dark:text-white"
    >
      <h2 className="text-lg font-semibold">
        Ajouter un article pour {selectedMagasin.nom}
      </h2>
      <div
        onClick={handleImageClick}
        className="mb-2 w-24 h-24 border border-black dark:border-white rounded overflow-hidden cursor-pointer hover:opacity-80 transition"
        title="Cliquez pour choisir une image"
      >
        <img
          src={preview || '/avatar.png'}
          alt="Prévisualisation"
          className="w-full h-full object-cover"
        />
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        type="text"
        placeholder="Nom de l’article"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="border border-black dark:border-white p-2 rounded bg-white dark:bg-black"
      />
      <input
        type="number"
        placeholder="Prix"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
        className="border border-black dark:border-white p-2 rounded bg-white dark:bg-black"
      />
      <div className="flex gap-4">
        {['CDF', 'USD'].map((val) => (
          <label key={val} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={devise === val}
              onChange={() => setDevise(val as 'CDF' | 'USD')}
              className="w-4 h-4 border border-black dark:border-white rounded-none cursor-pointer"
            />
            {val}
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? 'opacity-60' : 'hover:opacity-90'
        } bg-black text-white px-4 py-2 rounded transition`}
      >
        {loading ? 'Envoi...' : 'Ajouter l’article'}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.includes('succès') ? 'text-gray-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default UseAddArticle;
