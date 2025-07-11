// crypto-aes-gcm-node.ts
// ------------------------------------------------------------
//  Dependencias y alias WebCrypto para Node
// ------------------------------------------------------------
import { webcrypto as _webcrypto } from "node:crypto";
import { TextEncoder, TextDecoder } from "node:util";

const crypto = _webcrypto; // Web Crypto nativo en Node
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ------------------------------------------------------------
//  Utilidades Base64  (Uint8Array <-> base64)
// ------------------------------------------------------------
function uint8ToBase64(data: Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

function base64ToUint8(b64: string): Uint8Array {
  return Buffer.from(b64, "base64");
}

// ------------------------------------------------------------
//  Parámetros de seguridad
// ------------------------------------------------------------
const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256; // 32 bytes
const IV_LENGTH = 12; // 12 bytes (96 bits, estándar GCM)
const SALT_LENGTH = 16; // 16 bytes

// ------------------------------------------------------------
//  Derivación de clave (PBKDF2-HMAC-SHA-256)
// ------------------------------------------------------------
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH_BITS },
    false,
    ["encrypt", "decrypt"]
  );
}

// ------------------------------------------------------------
//  Tipado del resultado
// ------------------------------------------------------------
export interface EncryptedData {
  readonly salt: string; // base64
  readonly iv: string; // base64
  readonly authTag: string; // base64 (16 bytes finales del ciphertext)
  readonly ciphertext: string; // base64 (ciphertext + authTag)
}

// ------------------------------------------------------------
//  Cifrado
// ------------------------------------------------------------
export async function encryptAESGCM(
  plaintext: string,
  password: string
): Promise<EncryptedData> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const key = await deriveKey(password, salt);
  
  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    salt: uint8ToBase64(salt),
    iv: uint8ToBase64(iv),
    authTag: uint8ToBase64(new Uint8Array(ciphertextBuf.slice(-16))),
    ciphertext: uint8ToBase64(new Uint8Array(ciphertextBuf)),
  };
}

// ------------------------------------------------------------
//  Descifrado
// ------------------------------------------------------------
export async function decryptAESGCM(
  encrypted: EncryptedData,
  password: string
): Promise<string | null> {
  try {
    const salt = base64ToUint8(encrypted.salt); // 16 bytes
    const iv = base64ToUint8(encrypted.iv); // 12 bytes
    const ciphertext = base64ToUint8(encrypted.ciphertext); // n bytes

    if (iv.length !== IV_LENGTH) {
      throw new Error(`IV inválido: se esperaban ${IV_LENGTH} bytes`);
    }
    if (salt.length !== SALT_LENGTH) {
      throw new Error(`Salt inválida: se esperaban ${SALT_LENGTH} bytes`);
    }

    const key = await deriveKey(password, salt);

    const plaintextBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return decoder.decode(plaintextBuf);
  } catch (err) {
    console.error("Descifrado fallido:", err);
    return null; // o vuelve a lanzar el error si prefieres
  }
}
