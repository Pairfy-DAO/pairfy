import verifyDataSignature from "@cardano-foundation/cardano-verify-datasignature";

export function isValidSignatureCIP30(
  signature: string,
  key: string,
  message: string,
  address32: string
): boolean {
  try {
    return verifyDataSignature(signature, key, message, address32);
  } catch (err) {
    return false;
  }
}
