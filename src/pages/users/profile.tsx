import { base64ToImageSrc } from '../../utils/images/base64Image';
import { formatDateFR } from '../../utils/date';
import { useMe } from '../../hooks/users/me';
import { CheckCircle } from 'lucide-react';
import { formatTelephone } from '../../utils/phone';

function Profile() {
  const { user, loading, signOut } = useMe();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black transition-colors duration-300">
        <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-3xl shadow-md w-[340px] overflow-hidden">
          <div className="w-full h-64 bg-gray-200 dark:bg-neutral-700"></div>
          <div className="p-5">
            <div className="space-y-2 mb-5">
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black dark:bg-black dark:text-white transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg overflow-hidden w-[340px] transition-all duration-300 hover:shadow-2xl">
        <div className="relative">
          <img
            src={base64ToImageSrc(user.photo_profil) || './avatar.png'}
            alt={user.nom}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.nom}
            </h2>
            <CheckCircle className="text-blue-500 w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Concepteur de produits axé sur la simplicité et l'ergonomie
          </p>
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
            <p className="mb-2">
              <strong>Nom {user.nom}</strong>
            </p>
            <p className="mb-2">
              <strong>Téléphone </strong>{' '}
              {user.telephone
                ? formatTelephone(user.telephone)
                : 'Non renseigné'}
            </p>
            <p className="mb-2">
              <strong>Email {user.email}</strong>
            </p>
            {user.dt && (
              <p className="mb-2">
                <strong>Inscrit {formatDateFR(user.dt)}</strong>
              </p>
            )}
          </div>
          <button
            onClick={signOut}
            className="w-full border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 font-medium rounded-full py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
