import { gzip } from "pako";
import { Buffer } from 'buffer';

/**compress string or object using pako - returns base64 - use decompress */
export function compress(message: string | object): string {
  const input = typeof message === "string" ? message : JSON.stringify(message);
  return Buffer.from(gzip(input)).toString("base64");
}