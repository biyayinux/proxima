import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id?: number;
  nom: string;
  email: string;
  telephone?: string | null;
  photo_profil?: string | null; // Base64 ou data URL
  dt?: string;
}

export function useMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction de déconnexion
  const signOut = () => {
    localStorage.removeItem('token'); // Supprime le token JWT
    localStorage.removeItem('user'); // Supprime les données utilisateur
    setUser(null); // Réinitialise l'état local
    navigate('/signin'); // Redirige vers la page de connexion
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/auth/me`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error('Non autorisé');

        const data = await res.json();
        if (!data || !data.user)
          throw new Error('Données utilisateur manquantes');

        setUser(data.user);
        document.title = `Profil — ${data.user.nom || 'Utilisateur'}`;
      } catch (err) {
        console.error('Erreur récupération profil ', err);
        signOut();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return { user, loading, signOut };
}
