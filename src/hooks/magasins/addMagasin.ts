import { useState, useEffect, useRef } from 'react';
import { useMe } from '../../hooks/users/me';
import { toBase64 } from '../../utils/images/imageBase64';

export interface ApiResponse {
  message?: string;
  error?: string;
  magasin?: {
    id: number;
    nom: string;
    latitude?: number;
    longitude?: number;
    logo?: string;
  };
}

export function useAddMagasin() {
  const { user, loading } = useMe();
  const [nom, setNom] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Référence vers le champ file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Géolocalisation + titre
  useEffect(() => {
    document.title = `Ajouter un magasin — ${user?.nom || '...'} — Proxima`;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        (err) => console.warn('Erreur géolocalisation ', err.message),
      );
    }
  }, [user]);

  // Gestion du fichier et preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      const base64Logo = logoFile ? await toBase64(logoFile) : null;

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasins/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nom,
            logo: base64Logo,
            latitude,
            longitude,
          }),
        },
      );

      const data: ApiResponse = await res.json();

      if (!res.ok) setError(data.error || 'Erreur inconnue');
      else {
        setMessage(data.message || 'Magasin ajouté avec succès');
        setNom('');
        setLogoFile(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion au serveur');
    } finally {
      setSubmitting(false);
    }
  };

  // Clic sur l'image pour ouvrir le sélecteur
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return {
    user,
    loading,
    nom,
    setNom,
    preview,
    fileInputRef,
    handleFileChange,
    handleImageClick,
    latitude,
    longitude,
    message,
    error,
    submitting,
    handleSubmit,
  };
}
