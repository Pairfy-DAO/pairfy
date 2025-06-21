import forge from "node-forge";

export async function createSellerRSA() {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({
    bits: 2048,
  });

  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

  return {
    privateKeyPem,
    publicKeyPem,
  };
}



////////////////////////////////////////////BROWSER

export function encryptMessageWithPublicKey(publicKeyPem, message) {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const encrypted = publicKey.encrypt(
      forge.util.encodeUtf8(message),
      "RSA-OAEP",
      {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha1.create(),
        },
      }
    );

    return forge.util.encode64(encrypted);
  } catch (err) {
    console.error("🔒 Error encryptMessageWithPublicKey:", err);
    return null;
  }
}

export async function decryptMessageWithPrivateKey(
  privateKeyPem,
  ciphertextB64
) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

  const encryptedBytes = forge.util.decode64(ciphertextB64);

  const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha1.create(),
    },
  });

  return forge.util.decodeUtf8(decrypted);
}
