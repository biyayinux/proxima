import type { Article } from '../../hooks/typages/getIdMagasinUser';
import { base64ToImageSrc } from '../../utils/images/base64Image';
import { formatNumber } from '../../utils/number';
import { formatDateFR } from '../../utils/date';

interface Props {
  articles: Article[];
}

export default function GetMagasinArticlesUser({ articles }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {articles.map((article) => (
        <div
          key={article.id}
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-2"
        >
          <img
            src={
              article.photos && article.photos.length
                ? base64ToImageSrc(article.photos[0])
                : '/avatar.png'
            }
            alt={article.nom}
            className="w-full h-40 object-cover rounded"
          />
          <h3 className="font-semibold text-lg">{article.nom}</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Prix {formatNumber(article.prix)} {article.devise}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ajouté le {formatDateFR(article.date_creation)}
          </p>
        </div>
      ))}
    </div>
  );
}
