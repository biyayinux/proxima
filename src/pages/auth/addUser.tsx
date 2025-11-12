import { useAddUser } from '../../hooks/users/addUser';
import { User as UserIcon } from 'lucide-react';

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
      <h1 className="text-3xl font-bold mb-2">Compléter votre profil</h1>
      {user && (
        <p className="mb-6 text-gray-600 dark:text-gray-400 text-sm">
          {user.email}
        </p>
      )}
      {user && (
        <div className="w-full max-w-md flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border border-current mb-3 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-black dark:hover:ring-white transition"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              )}
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
            maxLength={17} // +243 xxx xxx xxx
            placeholder="+243 ___ ___ ___"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-current rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition text-center"
          />
          <input
            type="text"
            maxLength={20}
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-current rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold text-lg transition ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-80'
            }`}
          >
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
