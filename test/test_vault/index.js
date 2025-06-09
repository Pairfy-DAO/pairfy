import axios from "axios";

const VAULT_ADDR = "http://127.0.0.1:8200";

export async function authenticateWithVault(sellerJwt) {
  const url = `${VAULT_ADDR}/v1/auth/jwt/login`;

  const response = await axios.post(url, { jwt: sellerJwt });

  return response.data.auth.client_token;
}

export async function createRsaKeyForSeller(limitedToken, sellerId) {
  const url = `${VAULT_ADDR}/v1/transit/keys/seller-${sellerId}`;

  await axios.post(
    url,
    { type: "rsa-2048" },
    { headers: { "X-Vault-Token": limitedToken } }
  );
}

export async function getSellerPublicKey(limitedToken, sellerId) {
  const url = `${VAULT_ADDR}/v1/transit/keys/seller-${sellerId}`;

  const response = await axios.get(url, {
    headers: { "X-Vault-Token": limitedToken }
  });

  const version = response.data.data.latest_version;
  return response.data.data.keys[version].public_key;
}

export async function decryptWithSellerKey(limitedToken, sellerId, ciphertext) {
  const url = `${VAULT_ADDR}/v1/transit/decrypt/seller-${sellerId}`;

  const response = await axios.post(
    url,
    { ciphertext },
    { headers: { "X-Vault-Token": limitedToken } }
  );

  const plaintextB64 = response.data.data.plaintext;
  return Buffer.from(plaintextB64, "base64").toString("utf-8");
}
