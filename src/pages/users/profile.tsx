import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  picture?: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      document.title = `Profil — ${parsedUser.name}`;
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Profil de {user.name}</h1>
      <img
        src={user.picture}
        alt={user.name}
        className="rounded-full w-32 h-32 mb-4"
      />
      <p className="mb-2">
        <strong>Nom </strong> {user.name}
      </p>
      <p className="mb-4">
        <strong>Email </strong> {user.email}
      </p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        Déconnexion
      </button>
    </div>
  );
}

export default Profile;
