/**
 * Formate un numéro de téléphone au format : +243 xxx xxx xxx
 *
 * Exemple :
 *   formatTelephone(111111111)      ➜ "+243 111 111 111"
 *   formatTelephone(243111111111)   ➜ "+243 111 111 111"
 *   formatTelephone("+243111111111")➜ "+243 111 111 111"
 */

export function formatTelephone(numero?: string | number): string {
  if (numero === undefined || numero === null) return '';

  // Convertir le numéro en string
  let str = String(numero);

  // Supprimer tout ce qui n'est pas un chiffre
  const chiffres = str.replace(/\D/g, '');

  // Ajouter l'indicatif +243 s'il n'existe pas
  let numeroFormate: string;
  if (chiffres.startsWith('243')) {
    numeroFormate = '+' + chiffres;
  } else if (str.startsWith('+243')) {
    numeroFormate = str;
  } else {
    numeroFormate = '+243' + chiffres;
  }

  // Formater au style +243 xxx xxx xxx
  const match = numeroFormate.match(/^\+243(\d{3})(\d{3})(\d{3,})$/);
  if (match) {
    return `+243 ${match[1]} ${match[2]} ${match[3]}`;
  }

  // Retourne brut si format inattendu
  return numeroFormate;
}
