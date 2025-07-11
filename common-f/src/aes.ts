// crypto-aes-gcm-browser.ts
// ------------------------------------------------------------
//  WebCrypto y utilidades disponibles en el navegador
// ------------------------------------------------------------

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ------------------------------------------------------------
//  Utilidades Base64  (Uint8Array <-> base64, compatibles con Node)
// ------------------------------------------------------------
function uint8ToBase64(data: Uint8Array): string {
  // btoa/atob manejan strings en latin-1 ⇒ se convierte byte-a-byte
  let binary = "";
  data.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ------------------------------------------------------------
//  Parámetros de seguridad (idénticos a la versión Node)
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

/**@WARNING no error handling */
export async function decryptAESGCM(
  encrypted: EncryptedData,
  password: string
): Promise<string> {
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
}
