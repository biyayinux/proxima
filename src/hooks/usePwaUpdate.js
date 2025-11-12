import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwaUpdate() {
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log('Service Worker enregistré ', swUrl);
    },
    onRegisterError(error) {
      console.error('Erreur Service Worker ', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      console.log('Nouvelle version disponible, mise à jour automatique...');
      updateServiceWorker(true);
      window.location.reload();
    }
  }, [needRefresh, updateServiceWorker]);
}
