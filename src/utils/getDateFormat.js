export function getDateFormat(date) {
  const dateTime = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return dateTime?.format(new Date(date));
}
