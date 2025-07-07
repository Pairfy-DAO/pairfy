import { format, formatDistanceToNow } from 'date-fns';

// utils/utils.ts
export function truncateByWords(text: string, wordCount: number): string {
  if (!text || wordCount <= 0) return "";
  const words = text.trim().split(/\s+/);
  return words.slice(0, wordCount).join(" ");
}

export function sleep(ms: number) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

export function formatDateYYMMDD(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**15 February 2025 . 8:05 AM - 13 minutes ago*/
export function formatWithDateFns(timestamp: string) {
  const date = new Date(timestamp);
  const formattedDate = format(date, "dd MMMM yyyy '·' h:mm a"); 
  let timeAgo = formatDistanceToNow(date, { addSuffix: true }); 
  timeAgo = timeAgo.replace(/^about /, "");
  return `${formattedDate} - ${timeAgo}`;
}