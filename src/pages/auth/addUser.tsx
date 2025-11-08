import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

interface ExtendedUser extends User {
  username: string;
  phone: string;
  customPicture?: string;
}

function AddUser() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Compléter votre profil — Proxima';
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else navigate('/signUp');
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!user) return;
    const newUser: ExtendedUser = {
      ...user,
      username,
      phone,
      customPicture: preview || '/avatar.png',
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/profile');
  };

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
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 border border-current rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Enregistrer et continuer
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
