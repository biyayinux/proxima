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

  // Déconnexion
  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/signin');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Définit le titre immédiatement
    document.title = `Profil — ${parsedUser.nom || '...'} — Proxima`;

    setLoading(false);

    // Vérification côté serveur
    const verifyServer = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);

          // Met à jour le titre même si le nom a changé
          document.title = `Profil — ${data.user?.nom || '...'} — Proxima`;
        }
      } catch (err) {
        console.warn('Impossible de vérifier le token côté serveur ', err);
      }
    };

    verifyServer();
  }, [navigate]);

  return { user, loading, signOut };
}
