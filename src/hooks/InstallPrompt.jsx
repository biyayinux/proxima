import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log(`Installation ${outcome}`);
    setPromptEvent(null);
  };

  if (!promptEvent) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
    >
      Installer Proxima
    </button>
  );
}
