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