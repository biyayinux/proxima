import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMe } from '../../hooks/users/me';
import { toBase64 } from '../../utils/images/imageBase64';

export interface ApiResponse {
  message?: string;
  error?: string;
}

export function useAddArticle() {
  const { user } = useMe();
  const { id: magasinId } = useParams(); // ID du magasin depuis l'URL
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState<number | ''>('');
  const [devise, setDevise] = useState<'CDF' | 'USD'>('CDF');
  const [photosFiles, setPhotosFiles] = useState<File[]>([]);
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestion des fichiers photos
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setPhotosFiles(filesArray);
    setPreviewPhotos(filesArray.map((file) => URL.createObjectURL(file)));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('Utilisateur non connecté');
    if (!magasinId) return setError('ID du magasin manquant');
    if (photosFiles.length === 0)
      return setError('Au moins une photo est requise');

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token)
        return setError('Session expirée. Veuillez vous reconnecter.');

      const photosBase64 = await Promise.all(photosFiles.map(toBase64));

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/articles/userAddArticle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_magasin: magasinId,
            nom,
            prix,
            devise,
            photos: photosBase64,
          }),
        },
      );

      const data: ApiResponse = await res.json();

      if (!res.ok) setError(data.error || 'Erreur serveur');
      else {
        setMessage(data.message || 'Article ajouté avec succès');
        setNom('');
        setPrix('');
        setDevise('CDF');
        setPhotosFiles([]);
        setPreviewPhotos([]);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion au serveur');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    nom,
    setNom,
    prix,
    setPrix,
    devise,
    setDevise,
    photosFiles,
    previewPhotos,
    fileInputRef,
    handleFilesChange,
    submitting,
    message,
    error,
    handleSubmit,
  };
}
