import { useAddUser } from '../../hooks/users/addUser';

function AddUser() {
  const {
    user,
    username,
    setUsername,
    phone,
    setPhone,
    preview,
    handleImageUpload,
    handleSave,
    loading,
    error,
  } = useAddUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-4">
      <h1 className="text-2xl font-bold mb-6">Compléter votre profil</h1>
      {user && (
        <div className="w-full max-w-md flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border border-current mb-3 cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <img
                src={preview || '/avatar.png'}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <input
            type="text"
            maxLength={20}
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-current rounded bg-transparent focus:outline-none"
          />
          <input
            type="tel"
            maxLength={10}
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-current rounded bg-transparent focus:outline-none"
          />
          <p className="mt-2 text-sm opacity-80">
            <strong>Votre Email {user.email}</strong>
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-4 px-4 py-2 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer et continuer'}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
