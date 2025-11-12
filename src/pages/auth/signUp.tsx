import { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import image1 from '/images/illustrations/image1.png';
import googleIcon from '/images/icons/google.png';

interface User {
  name: string;
  email: string;
}

type CredentialResponse = import('@react-oauth/google').CredentialResponse;

function SignUp() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Inscription — Proxima';
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

  const handleSignUpError = () => {
    setError('Inscription Google échouée');
    setLoading(false);
  };

  const triggerGoogleLogin = () => {
    setLoading(true);
    const button = googleBtnRef.current?.querySelector(
      'div[role="button"]',
    ) as HTMLElement | null;

    if (button) {
      button.click();
    } else {
      setError('Le bouton Google n’est pas encore prêt. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-6 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="order-1 md:order-2 flex justify-center md:justify-end w-full md:w-auto mb-6 md:mb-0">
        <img
          src={image1}
          alt="Illustration"
          className="w-64 sm:w-80 md:w-[420px] lg:w-[480px] h-auto object-contain"
        />
      </div>
      <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Créez votre compte Proxima</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Inscrivez-vous pour commencer votre aventure avec nous
        </p>
        {error && <p className="text-red-500">{error}</p>}
        {user ? (
          <div className="text-center md:text-left">
            <p>Nom {user.name}</p>
            <p>Email {user.email}</p>
          </div>
        ) : (
          <>
            <button
              onClick={triggerGoogleLogin}
              disabled={loading}
              className={`relative z-10 w-64 py-3 flex items-center justify-center gap-3 rounded-full font-semibold text-lg transition ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-80'
              }`}
            >
              <img
                src={googleIcon}
                alt="Google Icon"
                className="w-5 h-5 object-contain"
              />
              {loading ? 'Inscription…' : "S'inscrire"}
            </button>
            <div
              ref={googleBtnRef}
              className="absolute opacity-0 pointer-events-none"
            >
              <GoogleLogin
                onSuccess={handleSignUpSuccess}
                onError={handleSignUpError}
              />
            </div>
          </>
        )}
        <div className="mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Déjà inscrit ?{' '}
            <Link
              to="/signIn"
              className="font-semibold text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-full transition hover:opacity-80"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
