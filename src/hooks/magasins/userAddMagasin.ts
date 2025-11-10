import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Met à jour le titre du document
  useEffect(() => {
    document.title = `Ajouter un magasin — ${user?.nom || '...'} — Proxima`;
  }, [user]);

  // Récupère la géolocalisation
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n’est pas supportée sur ce navigateur');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setGettingLocation(false);
        setError(null);
      },
      (err) => {
        setGettingLocation(false);
        setError('Impossible de récupérer la localisation ' + err.message);
      },
    );
  };

  // Gestion du logo (upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Clic sur l'image = ouverture du sélecteur
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setSubmitting(false);
        return;
      }

      const base64Logo = logoFile ? await toBase64(logoFile) : null;

      const res = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/magasins/userAddMagasin`,
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

      if (!res.ok) {
        setError(data.error || 'Erreur inconnue');
      } else if (data.magasin?.id) {
        // Redirection vers le magasin créé
        navigate(`/magasin/${data.magasin.id}`);
      } else {
        setError('Erreur: l’ID du magasin est introuvable');
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
    loading,
    nom,
    setNom,
    preview,
    fileInputRef,
    handleFileChange,
    handleImageClick,
    latitude,
    longitude,
    gettingLocation,
    error,
    submitting,
    getLocation,
    handleSubmit,
  };
}
