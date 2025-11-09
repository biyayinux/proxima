import { base64ToImageSrc } from '../../utils/base64Image';
import { formatDateFR } from '../../utils/date';
import { useMe } from '../../hooks/users/me';

function Profile() {
  const { user, loading, signOut } = useMe();

  if (loading)
    return (
      <p className="min-h-screen flex items-center justify-center">
        Chargement...
      </p>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Profil de {user.nom}</h1>
      <img
        src={base64ToImageSrc(user.photo_profil) || './avatar.png'}
        alt={user.nom}
        className="rounded-full w-32 h-32 mb-4 object-cover"
      />
      <p className="mb-2">
        <strong>Nom {user.nom}</strong>
      </p>
      <p className="mb-2">
        <strong>Téléphone {user.telephone}</strong>
      </p>
      <p className="mb-2">
        <strong>Email {user.email}</strong>
      </p>
      {user.dt && <p className="mb-2">Inscrit {formatDateFR(user.dt)}</p>}
      <button
        onClick={signOut}
        className="px-4 py-2 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        Déconnexion
      </button>
    </div>
  );
}

export default Profile;
