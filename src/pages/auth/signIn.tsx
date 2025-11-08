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
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Connexion — Proxima';
  }, []);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse?.credential) {
      const decoded = jwtDecode<{
        name: string;
        email: string;
        picture?: string;
      }>(credentialResponse.credential);
      const userData: User = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/profile');
    }
  };

  const handleLoginError = () => console.error('Connexion Google échouée');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Connexion avec Google OAuth2</h1>
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
