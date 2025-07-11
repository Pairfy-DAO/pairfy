import forge from "node-forge";
import { Buffer } from "buffer";

/**decrypt a string with privateKeyB64 RSA private key
 * @WARNING no error handling*
 * @returns utf-8 string */
export function decryptMessageWithPrivateKey(
  privateKeyB64: string,
  ciphertextB64: string
) {
  if (!privateKeyB64 || !ciphertextB64) {
    throw new Error(
      `decryptMessageWithPrivateKeyError required params`
    );
  }

  const raw = Buffer.from(privateKeyB64, "base64").toString("utf8");

  const privateKey = forge.pki.privateKeyFromPem(raw);

  const encryptedBytes = forge.util.decode64(ciphertextB64);

  const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });

  return forge.util.decodeUtf8(decrypted);
}