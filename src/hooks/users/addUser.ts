import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toBase64 } from '../../utils/images/imageBase64';

// Interfaces utilisateur
interface User {
  name: string;
  email: string;
}

interface ExtendedUser extends User {
  username: string;
  phone: string;
  customPicture?: string;
}

// Hook personnalisé pour l'inscription
function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (
    email: string,
    telephone: string,
    nom: string,
    photo_profil?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_MIDDLEWARE_URL}/api/auth/signUp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, telephone, nom, photo_profil }),
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Erreur lors de la création du compte');

      // Stocker le token JWT reçu
      localStorage.setItem('token ', data.token);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur API ', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}

// Hook principal pour gérer la logique complète du composant AddUser
export function useAddUser() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const { signUp, loading, error } = useSignUp();

  useEffect(() => {
    document.title = 'Compléter votre profil — Proxima';
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else navigate('/signUp');
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    let base64Image: string | undefined = undefined;

    if (file) {
      try {
        base64Image = await toBase64(file);
      } catch (err) {
        console.error('Erreur conversion image ', err);
      }
    }

    const newUser: ExtendedUser = {
      ...user,
      username,
      phone,
      customPicture: preview || '/avatar.png',
    };

    try {
      const result = await signUp(
        newUser.email,
        newUser.phone,
        newUser.username,
        base64Image,
      );

      localStorage.setItem('user ', JSON.stringify(newUser));
      console.log('Utilisateur créé ', result);
      navigate('/profile');
    } catch (err) {
      console.error('Erreur lors de l’inscription ', err);
    }
  };

  return {
    user,
    username,
    setUsername,
    phone,
    setPhone,
    preview,
    handleImageUpload,
    handleSave,
    loading,
    error,
  };
}
