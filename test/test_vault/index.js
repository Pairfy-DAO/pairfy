import axios from "axios";
import forge from "node-forge";

const VAULT_ADDR = "http://localhost:8200";

export async function authenticateWithVault(sellerJwt) {
  const url = `${VAULT_ADDR}/v1/auth/jwt/login`;

  try {
    const response = await axios.post(url, {
      jwt: sellerJwt,
      role: "seller-role",
    });

    return response.data.auth.client_token || null;
  } catch (error) {
    console.error(
      "Vault authentication failed:",
      error?.response?.data?.errors || error.message
    );
    return null;
  }
}

export async function createRsaKeyForSeller(limitedToken, sellerId) {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({
    bits: 2048,
  });

  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

  const url = `${VAULT_ADDR}/v1/secrets/seller-${sellerId}`;

  try {
    const response = await axios.post(
      url,
      {
        private_key: privateKeyPem,
        public_key: publicKeyPem,
      },
      {
        headers: {
          "X-Vault-Token": limitedToken,
        },
      }
    );

    return {
      publicKeyPem,
      vaultResponse: response.data,
    };
  } catch (err) {
    console.error(
      "Vault KV RSA key storage failed:",
      err?.response?.data?.errors || err.message
    );
    return null;
  }
}

export async function getSellerPublicKey(limitedToken, sellerId) {
  const url = `${VAULT_ADDR}/v1/secrets/seller-${sellerId}`;

  try {
    const response = await axios.get(url, {
      headers: { "X-Vault-Token": limitedToken },
    });

    return response.data.data.public_key || false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

////////////////////////////////////////////BROWSER

export function encryptWithPubKey(publicKeyPem, message) {
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
    console.error("🔒 Error al cifrar mensaje:", err);
    return null;
  }
}

export async function decryptWithSellerKey(limitedToken, sellerId, ciphertextB64) {
  const url = `${VAULT_ADDR}/v1/secrets/seller-${sellerId}`;

  const res = await axios.get(url, {
    headers: { "X-Vault-Token": limitedToken },
  });
  const privateKeyPem = res.data.data.private_key;
  if (!privateKeyPem) {
    throw new Error("Clave privada no encontrada en Vault.");
  }

  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

  // 3. Descifrar
  const encryptedBytes = forge.util.decode64(ciphertextB64);
  const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha1.create(),
    },
  });

  return forge.util.decodeUtf8(decrypted);
}

async function main() {
  const sellerJwt =
    "eyJqd3QiOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJakZEUkRsQk5qZzBRVEE0UWpsRE5qazFNakF6TnlJc0luSnZiR1VpT2lKVFJVeE1SVklpTENKbGJXRnBiQ0k2SW5SbGMzUmxjakZBWjIxaGFXd3VZMjl0SWl3aVlYWmhkR0Z5SWpvaWFIUjBjSE02THk5bGVHRnRjR3hsTG1OdmJTOWhkbUYwWVhJdWFuQm5JaXdpWVdSa2NtVnpjeUk2SW1Ga1pISmZkR1Z6ZERGeGVqTnlibVZyZW1nd2RESnVkV1Y1YmpScU5teHRkV1pqTWpod1ozVXdaSEZzZW1wdWJYRjRjMnA0ZG5wek1qUnhkR3AxZUc1d2FIbHhlSG8wTm5RME1HNTFaRzV0TTJ0NGRUaG9hMkYxTW0xeE5tNTNOM04yWnpkcWMzZHlkWGQ1TXlJc0ltTnZkVzUwY25raU9pSlZVeUlzSW5WelpYSnVZVzFsSWpvaVZHVnpkR1Z5TVRJeklpd2ljSFZpYTJWNWFHRnphQ0k2SW1FeU16bGxObU15WW1Ka05tRTVaak15TkRsa05qVmhabVZtT0Rsak1qaGxNVFEzTVdWa01EZGpOVEk1WldNd05qZzBPR05qTVRReElpd2lhV0YwSWpveE56UTVORGt5TnpReUxDSmxlSEFpT2pFM05UQXdPVGMxTkRJc0ltRjFaQ0k2V3lKMllYVnNkQ0lzSW1sdWRHVnlibUZzSWwwc0ltbHpjeUk2SW5ObGNuWnBZMlV0YzJWc2JHVnlJbjAuZkF5R2hjMTB6UHA1MDRzQnV6UkJoNHJKUmtoOWN2SDZTTkQzbU1aOVZOVm11ak0zdklOMDRydk1LbWFsQUtYVktJb2dCWmNOVG5NNDF1YXhhNzY3cE5zeXl5WHQtQmJFRG95UkxEZ2xKcnFOQVhxWURQQVMyaXJNd29McHZ5VjhDMVEtQ3d0VkxxQ2lyQ21uVkd0Ui1qSFlRMHBscWJveWU1eDRmN2Y1VU1pSWw0UW51eFZTSHFLbk5HZWpSaVBpSzBSVGJiMUV6UnI3Z2J3dWE4MTQwQjFleTI2X2c4QlJ4RFAzanc5NlBMdllvRzlPWjNMTGlidFB1NkdzQjdhMnNDRGZmZE1KMUJyeGRMWjdHeHZXX0x2U1ZQeXJxakNBRFVZZTZoeUZPOUFUdEdxME5FT1hjUjRSck53eXZHQnZkTlVxaGJ0Q0lTR0tTMHQ0T2RVc2tnIn0";

  const sellerId = "1CD9A684A08B9C6952037";

  const decoded = Buffer.from(sellerJwt, "base64").toString("utf-8");

  const parsed = JSON.parse(decoded);

  const limitedToken = await authenticateWithVault(parsed.jwt);

  console.log("limitedToken: ", limitedToken);

  const createRSA = await createRsaKeyForSeller(limitedToken, sellerId);

  console.log("createRSA: ", createRSA.publicKeyPem.slice(0, 30));

  const publicKey = await getSellerPublicKey(limitedToken, sellerId);

  console.log("publicKey: ", publicKey);

  const encrypted = await encryptWithPubKey(publicKey, "this is the message");

  console.log("encrypted: ", encrypted);

  const decrypted = await decryptWithSellerKey(limitedToken, sellerId, encrypted);

  console.log("message: ", decrypted)
}

main();
