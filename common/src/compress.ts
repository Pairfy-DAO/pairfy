import { gzip } from "pako";

export function compress(message: string | object): string {
  const input = typeof message === "string" ? message : JSON.stringify(message);
  return Buffer.from(gzip(input)).toString("base64");
}