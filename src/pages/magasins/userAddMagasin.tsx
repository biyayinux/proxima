import { useAddMagasin } from '../../hooks/magasins/userAddMagasin';

function userAddMagasin() {
  const {
    user,
    loading,
    nom,
    setNom,
    preview,
    fileInputRef,
    handleFileChange,
    handleImageClick,
    latitude,
    longitude,
    gettingLocation,
    error,
    submitting,
    getLocation,
    handleSubmit,
  } = useAddMagasin();

  if (loading)
    return (
      <p className="min-h-screen flex items-center justify-center">
        Chargement...
      </p>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-4">
      <h1 className="text-2xl font-bold mb-6">Ajouter un magasin</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm"
      >
        <div className="flex flex-col items-center">
          <div
            onClick={handleImageClick}
            className="mb-3 w-24 h-24 border border-gray-300 rounded overflow-hidden cursor-pointer hover:opacity-80 transition"
            title="Cliquez pour choisir une image"
          >
            <img
              src={preview || '/avatar.png'}
              alt="Logo aperçu"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            ref={fileInputRef}
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <label htmlFor="nom" className="block mb-1 font-medium">
            Nom du magasin
          </label>
          <input
            id="nom"
            type="text"
            maxLength={30}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring focus:ring-gray-500"
          />
        </div>
        {latitude && longitude ? (
          <p className="text-sm text-center text-black dark:text-white">
            {latitude.toFixed(5)} . {longitude.toFixed(5)}
          </p>
        ) : (
          <p className="text-sm text-center text-gray-500">
            Aucune position détectée
          </p>
        )}
        <button
          type="button"
          onClick={getLocation}
          disabled={gettingLocation}
          className="mt-1 px-4 py-2 border border-gray-500 rounded-lg text-black dark:text-white hover:bg-gray-600 hover:text-white transition disabled:opacity-50"
        >
          {gettingLocation ? 'Récupération...' : 'Obtenir ma position'}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2 border border-gray-600 text-black dark:text-white rounded hover:bg-gray-600 hover:text-white transition disabled:opacity-50"
        >
          {submitting ? 'Ajout en cours...' : 'Ajouter le magasin'}
        </button>
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default userAddMagasin;
