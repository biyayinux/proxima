import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

type CredentialResponse = import('@react-oauth/google').CredentialResponse;

function SignUp() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "S'inscrire — Proxima";
  }, []);

  const handleSignUpSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse?.credential) {
      const decoded = jwtDecode<{ name: string; email: string }>(
        credentialResponse.credential,
      );
      const userData: User = {
        name: decoded.name,
        email: decoded.email,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/addUser');
    }
  };

  const handleSignUpError = () => console.error('Inscription Google échouée');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-4">
      <h1 className="text-2xl font-bold mb-6">S'inscrire avec Google</h1>

      {!user && (
        <GoogleLogin
          onSuccess={handleSignUpSuccess}
          onError={handleSignUpError}
        />
      )}

      {user && (
        <div className="flex flex-col items-center gap-4">
          <img
            src="/avatar.png"
            alt="Avatar par défaut"
            className="w-20 h-20 rounded-full border border-current mb-3"
            onClick={() => document.getElementById('fileInput')?.click()}
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
          />
          <p className="text-center mt-2">
            Nom {user.name} <br /> Email {user.email}
          </p>
        </div>
      )}

      <Link
        to="/signIn"
        className="mt-6 text-blue-600 dark:text-blue-400 hover:underline"
      >
        Déjà inscrit ? Se connecter
      </Link>
    </div>
  );
}

export default SignUp;
