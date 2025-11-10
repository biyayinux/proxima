export function formatNumber(value: number | string): string {
  if (value === null || value === undefined) return '';

  // Convertir en string et enlever tout caractère non numérique
  const num = Number(value);
  if (isNaN(num)) return String(value);

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
