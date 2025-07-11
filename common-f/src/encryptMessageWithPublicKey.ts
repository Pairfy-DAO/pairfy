import forge from "node-forge";
import { Buffer } from "buffer";

/**Encrypt a string with base64Pem RSA public key - max 190 bytes 
 * @WARNING - no error handling*
 * @returns base64 string */
export function encryptMessageWithPublicKey(
    base64Pem: string,
    message: string
  ) {
    const maxLength = 190;
    const byteLength = Buffer.byteLength(message, "utf8");

    if (byteLength > maxLength) {
      throw new Error(
        `encryptMessageWithPublicKeyError. Message too long. Max allowed for RSA-2048 + SHA-256 is ${maxLength} bytes.`
      );
    }

    const raw = Buffer.from(base64Pem, "base64").toString("utf8");

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
  }