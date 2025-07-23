import { UTxO } from "@lucid-evolution/lucid";

export function sumLovelaceFromUtxos(utxos: UTxO[]): bigint {
  return utxos.reduce((total, utxo) => {
    const quantity =
      typeof utxo.assets?.lovelace === "bigint" ? utxo.assets.lovelace : 0n;
      
    return total + quantity;
  }, 0n);
}
