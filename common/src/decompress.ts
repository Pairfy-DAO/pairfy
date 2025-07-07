import { ungzip } from "pako";

export function decompress(compressed: string): string {
  const buffer = Buffer.from(compressed, "base64");
  return new TextDecoder().decode(ungzip(buffer));
}