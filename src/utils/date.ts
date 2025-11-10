export function formatDateFR(date: string | Date): string {
  if (!date) return 'Date inconnue';

  const d = typeof date === 'string' ? new Date(date) : date;

  // Vérifie que la date est valide
  if (isNaN(d.getTime())) return 'Date invalide';

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return d.toLocaleDateString('fr-FR', options);
}
