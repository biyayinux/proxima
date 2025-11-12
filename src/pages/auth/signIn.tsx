import { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import image1 from '/images/illustrations/image1.png';
import googleIcon from '/images/icons/google.png'; // Icône Google

interface User {
  name: string;
  email: string;
  picture?: string;
}

type CredentialResponse = import('@react-oauth/google').CredentialResponse;

function SignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);

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
          setLoading(false);
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/all');
      } catch (err: any) {
        console.error('Erreur API SignIn ', err);
        setError('Erreur serveur, réessayez plus tard');
        setLoading(false);
      }
    }
  };

  const handleLoginError = () => {
    setError('Connexion Google échouée');
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
        <h1 className="text-3xl font-bold">Bienvenue sur Proxima</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Connectez-vous pour accéder à votre espace personnel
        </p>
        {error && <p className="text-red-500">{error}</p>}
        {user ? (
          <div>
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
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
            <div
              ref={googleBtnRef}
              className="absolute opacity-0 pointer-events-none"
            >
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          </>
        )}
        <div className="mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Pas encore de compte ?{' '}
            <Link
              to="/signUp"
              className="font-semibold text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-full transition hover:opacity-80"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
