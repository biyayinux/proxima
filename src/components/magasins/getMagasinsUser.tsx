import { Link } from 'react-router-dom';
import type { Magasin } from '../../hooks/typages/getMagasinsUser';
import { base64ToImageSrc } from '../../utils/images/base64Image';

interface Props {
  magasins: Magasin[];
}

export default function GetMagasinsUser({ magasins }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {magasins.map((magasin) => (
        <Link
          key={magasin.id}
          to={`/magasin/${magasin.id}`}
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow duration-200"
        >
          <img
            src={magasin.logo ? base64ToImageSrc(magasin.logo) : '/avatar.png'}
            alt={magasin.nom}
            className="w-24 h-24 object-cover rounded"
          />
          <h2 className="font-semibold text-lg text-center">{magasin.nom}</h2>
        </Link>
      ))}
    </div>
  );
}
