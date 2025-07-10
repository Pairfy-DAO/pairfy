import { ungzip } from "pako";

export function decompress(value: string): string | null {
  if (!value) {
    return null;
  }

  const buffer = Buffer.from(value, "base64");
  return new TextDecoder().decode(ungzip(buffer));
}
