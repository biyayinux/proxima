export function formatDateFR(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  // Options pour un format court en français
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return d.toLocaleDateString('fr-FR', options);
}
