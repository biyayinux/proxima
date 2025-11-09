//Convertit un fichier image en Base64
export async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Supprimer le préfixe
      const base64Data = result.replace(/^data:[^;]+;base64,/, '');
      resolve(base64Data);
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
