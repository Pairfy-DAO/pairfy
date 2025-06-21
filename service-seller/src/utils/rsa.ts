import forge from "node-forge";

export type RSAKeyPair = {
  privateKeyB64: string;
  publicKeyB64: string;
};

export function generateRSA(): Promise<RSAKeyPair> {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair(
      { bits: 2048, workers: -1 },
      (err, keypair) => {
        if (err) return reject(err);

        const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
        const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

        const privateKeyB64 = Buffer.from(privateKeyPem).toString("base64");
        const publicKeyB64 = Buffer.from(publicKeyPem).toString("base64");

        resolve({ privateKeyB64, publicKeyB64 });
      }
    );
  });
}
