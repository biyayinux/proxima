// Convertit une chaîne Base64 en URL utilisable dans une balise <img>
export function base64ToImageSrc(base64: string | null | undefined): string {
  if (base64?.startsWith('data')) return base64; // Déjà une data URL
  // Sinon on suppose PNG par défaut
  return `data:image/png;base64,${base64}`;
}

// Convertit une chaîne Base64 en Blob pour le téléchargement
export function base64ToBlob(base64: string, mime = 'image/png'): Blob {
  const byteString = atob(base64.replace(/^data:.*;base64,/, ''));
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}
