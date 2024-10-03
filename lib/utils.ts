import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const monthNames = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
};

export function formatDate(dateString: string, locale: 'en' | 'es'): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthNames[locale][date.getMonth()];
  const year = date.getFullYear();

  if (locale === 'en') {
    return `${month} ${day}, ${year}`;
  } else {
    return `${day} de ${month} de ${year}`;
  }
}
