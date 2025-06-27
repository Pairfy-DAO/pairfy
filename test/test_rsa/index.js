import forge from "node-forge";
import { gzip, ungzip } from "pako";

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

    const maxLength = 190;
    const byteLength = Buffer.byteLength(message, 'utf8');
    
    if (byteLength > maxLength) {
      throw new Error(`Message too long. Max allowed for RSA-2048 + SHA-256 is ${maxLength} bytes.`);
    }

    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

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
      md: forge.md.sha256.create(),
    },
  });

  return forge.util.decodeUtf8(decrypted);
}

//////////////////////////////////////////////////////////////

function compressMessage(message) {
  return Buffer.from(gzip(message)).toString("base64");
}

const main = async () => {
  const { privateKeyPem, publicKeyPem } = await createSellerRSA();

  const message = {
    r: "x".repeat(50), //receiver alias
    n: "A".repeat(50), //note
    a: ",".repeat(100), //address
  };

  const compressed = compressMessage(JSON.stringify(message))

  console.log(compressed.length);

  const encrypted = encryptMessageWithPublicKey(publicKeyPem, compressed);

  console.log(encrypted);
};

main();
