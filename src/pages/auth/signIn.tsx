import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  picture?: string;
}

type CredentialResponse = import('@react-oauth/google').CredentialResponse;

function SignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Connexion — Proxima';
  }, []);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse?.credential) {
      const decoded = jwtDecode<{
        name: string;
        email: string;
        picture?: string;
      }>(credentialResponse.credential);

      const email = decoded.email;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MIDDLEWARE_URL}/api/auth/signIn`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Erreur lors de la connexion');
          return;
        }

        // Si tout est ok, stocker token + user et rediriger
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/profile');
      } catch (err: any) {
        console.error('Erreur API SignIn ', err);
        setError('Erreur serveur, réessayez plus tard');
      }
    }
  };

  const handleLoginError = () => setError('Connexion Google échouée');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Connexion avec Google OAuth2</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <div>
          <p>Nom {user.name}</p>
          <p>Email {user.email}</p>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      )}
    </div>
  );
}

export default SignIn;
