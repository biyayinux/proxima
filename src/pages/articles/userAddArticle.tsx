import { useAddArticle } from '../../hooks/articles/userAddArticle';

export default function userAddArticle() {
  const {
    nom,
    setNom,
    prix,
    setPrix,
    devise,
    setDevise,
    previewPhotos,
    fileInputRef,
    handleFilesChange,
    submitting,
    message,
    error,
    handleSubmit,
  } = useAddArticle();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-4">
      <h1 className="text-2xl font-bold mb-6">Ajouter un article</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm"
      >
        <div className="flex flex-col items-center">
          <div
            onClick={handleImageClick}
            className="mb-3 w-32 h-32 border border-gray-300 rounded overflow-hidden cursor-pointer hover:opacity-80 transition"
            title="Cliquez pour choisir une ou plusieurs images"
          >
            {previewPhotos.length > 0 ? (
              <img
                src={previewPhotos[0]}
                alt="Aperçu photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                + Ajouter photo
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
          {previewPhotos.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {previewPhotos.slice(1).map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`preview ${i}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="nom" className="block mb-1 font-medium">
            Nom de l'article
          </label>
          <input
            id="nom"
            type="text"
            maxLength={50}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring focus:ring-gray-500"
          />
        </div>
        <div>
          <label htmlFor="prix" className="block mb-1 font-medium">
            Prix
          </label>
          <input
            id="prix"
            type="number"
            min={0}
            value={prix}
            onChange={(e) => setPrix(Number(e.target.value))}
            required
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring focus:ring-gray-500"
          />
        </div>
        <div>
          <span className="block mb-1 font-medium">Devise</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={devise === 'CDF'}
                onChange={() => setDevise('CDF')}
                className="accent-black dark:accent-white"
              />
              CDF
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={devise === 'USD'}
                onChange={() => setDevise('USD')}
                className="accent-black dark:accent-white"
              />
              USD
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2 border border-gray-600 text-black dark:text-white rounded hover:bg-gray-600 hover:text-white transition disabled:opacity-50"
        >
          {submitting ? 'Ajout en cours...' : 'Ajouter l’article'}
        </button>
        {message && (
          <p className="text-gray-600 text-center text-sm">{message}</p>
        )}
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}
      </form>
    </div>
  );
}
