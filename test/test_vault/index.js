import axios from "axios";

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
    console.error("Vault authentication failed:", error?.response?.data?.errors || error.message);
    return null;
  }
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
    headers: { "X-Vault-Token": limitedToken },
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

async function main() {
  const sellerJwt =
    "eyJqd3QiOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJakZEUkRsQk5qZzBRVEE0UWpsRE5qazFNakF6TnlJc0luSnZiR1VpT2lKVFJVeE1SVklpTENKbGJXRnBiQ0k2SW5SbGMzUmxjakZBWjIxaGFXd3VZMjl0SWl3aVlYWmhkR0Z5SWpvaWFIUjBjSE02THk5bGVHRnRjR3hsTG1OdmJTOWhkbUYwWVhJdWFuQm5JaXdpWVdSa2NtVnpjeUk2SW1Ga1pISmZkR1Z6ZERGeGVqTnlibVZyZW1nd2RESnVkV1Y1YmpScU5teHRkV1pqTWpod1ozVXdaSEZzZW1wdWJYRjRjMnA0ZG5wek1qUnhkR3AxZUc1d2FIbHhlSG8wTm5RME1HNTFaRzV0TTJ0NGRUaG9hMkYxTW0xeE5tNTNOM04yWnpkcWMzZHlkWGQ1TXlJc0ltTnZkVzUwY25raU9pSlZVeUlzSW5WelpYSnVZVzFsSWpvaVZHVnpkR1Z5TVRJeklpd2ljSFZpYTJWNWFHRnphQ0k2SW1FeU16bGxObU15WW1Ka05tRTVaak15TkRsa05qVmhabVZtT0Rsak1qaGxNVFEzTVdWa01EZGpOVEk1WldNd05qZzBPR05qTVRReElpd2lhV0YwSWpveE56UTVORFF3T1RZMExDSmxlSEFpT2pFM05UQXdORFUzTmpRc0ltRjFaQ0k2V3lKMllYVnNkQ0lzSW1sdWRHVnlibUZzSWwwc0ltbHpjeUk2SW5ObGNuWnBZMlV0YzJWc2JHVnlJbjAua0EwM3NRb0Vpd1Z4VWp6NlN5TVBPNDZsRFRnMm82M0FvLWVpUW9hSS1mVDBabC1jOHRaTDJxSEswNnVkY0JZd21WX2VGQUFtbFlNYXBYM0JCT2NQbS04QlhEcFBzZVdEVUpOY0pNVzJHa010cnJ6dExOWGhEcFZvdGV1Ni0wbHI5aEtINXBXSExGUEk2eGhpNVRYcFZfRUxVMF9Ub21QNzRSblJCcjRqSXA2dUhsWFBFeXZXS2kxU0JsWm1KSjdDR1hoRTl4QnhhMGM1X3h3LVJZbFNqdTc1ZThVRXBuaVlxVVpGaFJXSGlNZmRObG5ORkJhUVlPaDEzdG5RY2lhOVFDQ0ZtYndkdndpMHl6YkJaU01za0ZuS2duR2JyYW1QVU43aTlwZjNxSzliTTg0MGx2M3V6dGpUT1FBanhtczBRRC13amhyRF9CWkVCMVVVMlFldEZnIn0";

  const sellerId = "sellerId1";

  const decoded = Buffer.from(sellerJwt, "base64").toString("utf-8");

  const parsed = JSON.parse(decoded);

  const limitedToken = await authenticateWithVault(parsed.jwt);

  console.log("limitedToken: ", limitedToken);

  //const createRSA = await createRsaKeyForSeller(limitedToken, sellerId);
}

main();
