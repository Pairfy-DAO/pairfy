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
