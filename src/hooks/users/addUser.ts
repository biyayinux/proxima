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

// Hook pour l'inscription
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

      localStorage.setItem('token', data.token);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur API', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}

// Hook principal pour AddUser
export function useAddUser() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('+243 ');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const { signUp, loading, error } = useSignUp();

  // Récupération de l'utilisateur depuis localStorage
  useEffect(() => {
    document.title = 'Compléter votre profil — Proxima';
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else navigate('/signUp');
  }, [navigate]);

  // Upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  // Gestion du format du numéro de téléphone
  const handlePhoneChange = (value: string) => {
    // Supprimer tout sauf les chiffres
    const digits = value.replace(/\D/g, '');
    // Retirer l’indicatif +243
    const number = digits.startsWith('243')
      ? digits.slice(3, 12)
      : digits.slice(0, 9);
    // Limiter à 9 chiffres
    const limited = number.slice(0, 9);

    // Formater en groupes de 3 chiffres
    const formatted = '+243 ' + limited.replace(/(\d{3})(?=\d)/g, '$1 ').trim();

    setPhone(formatted);
  };

  // Sauvegarde
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
      customPicture: preview || undefined,
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
      navigate('/all');
    } catch (err) {
      console.error('Erreur lors de l’inscription ', err);
    }
  };

  return {
    user,
    username,
    setUsername,
    phone,
    setPhone: handlePhoneChange,
    preview,
    handleImageUpload,
    handleSave,
    loading,
    error,
  };
}
