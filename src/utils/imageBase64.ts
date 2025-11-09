/**
 * Convertit un fichier image en Base64 (sans préfixe data:image/...).
 * @param file Fichier image à convertir
 * @returns Chaîne base64 pure (Promise<string>)
 */
export async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Supprimer le préfixe "data:image/...;base64,"
      const base64Data = result.replace(/^data:[^;]+;base64,/, '');
      resolve(base64Data);
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
