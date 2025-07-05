import forge from "node-forge";
import { gzip } from "pako";
import { Buffer } from "buffer";
import { format, formatDistanceToNow } from 'date-fns';

// utils/utils.ts
export function truncateByWords(text: string, wordCount: number): string {
  if (!text || wordCount <= 0) return "";
  const words = text.trim().split(/\s+/);
  return words.slice(0, wordCount).join(" ");
}

export function formatUSD(amount: number) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new TypeError("Amount must be a finite number");
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted.replace(/\$/g, "").trim();
}

export function truncateText(text: string, maxLength: number) {
  if (typeof text !== "string") return "";
  if (maxLength <= 3) return ".".repeat(maxLength);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + "...";
}

export function chunkMetadata(str: string, size: number): string[] {
  if (!str || size <= 0) return [];

  const chunks: string[] = [];

  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }

  return chunks;
}

export function truncateMiddle(hash: string, length = 6) {
  if (typeof hash !== "string" || hash.length <= length * 2) {
    return hash;
  }

  const start = hash.slice(0, length);
  const end = hash.slice(-length);
  return `${start} ...... ${end}`;
}

export function encryptMessageWithPublicKey(
  publicKeyPem: string,
  message: string
) {
  try {
    const maxLength = 190;
    const byteLength = Buffer.byteLength(message, "utf8");

    if (byteLength > maxLength) {
      throw new Error(
        `Error encrypting address. Message too long. Max allowed for RSA-2048 + SHA-256 is ${maxLength} bytes.`
      );
    }

    const raw = Buffer.from(publicKeyPem, "base64").toString("utf8");

    const publicKey = forge.pki.publicKeyFromPem(raw);

    const encrypted = publicKey.encrypt(
      forge.util.encodeUtf8(message),
      "RSA-OAEP",
      {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create(),
        },
      }
    );

    return forge.util.encode64(encrypted);
  } catch (err) {
    console.error("🔒 encryptMessageWithPublicKey:", err);
    throw err;
  }
}

export function compressMessage(message: string) {
  return Buffer.from(gzip(message)).toString("base64");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timestampToDate(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export async function copyToClipboard(text: string) {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

/**15 February 2025 . 8:05 AM - 13 minutes ago*/
export function formatWithDateFns(timestamp: string) {
  const date = new Date(timestamp);
  const formattedDate = format(date, "dd MMMM yyyy . h:mm a"); 
  let timeAgo = formatDistanceToNow(date, { addSuffix: true }); 
  timeAgo = timeAgo.replace(/^about /, "");
  return `${formattedDate} - ${timeAgo}`;
}