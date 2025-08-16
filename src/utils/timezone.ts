
import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const IST_TIMEZONE = 'Asia/Kolkata';

export const formatToIST = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const istDate = toZonedTime(dateObj, IST_TIMEZONE);
  return format(istDate, "yyyy-MM-dd'T'HH:mm");
};

export const parseFromIST = (dateString: string) => {
  const localDate = new Date(dateString);
  return fromZonedTime(localDate, IST_TIMEZONE);
};

export const formatDisplayDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const istDate = toZonedTime(dateObj, IST_TIMEZONE);
  return format(istDate, 'PPP p');
};
