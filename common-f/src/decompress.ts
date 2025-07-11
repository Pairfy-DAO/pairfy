import { ungzip } from "pako";

/**decompress base64 string compressed by compress.ts pako gzip */
export function decompress(value: string): string | null {
  if (!value) {
    return null;
  }

  const buffer = Buffer.from(value, "base64");
  return new TextDecoder().decode(ungzip(buffer));
}
