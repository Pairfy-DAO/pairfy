import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

document.getElementById('connect').addEventListener('click', async () => {
  const wallet = 'eternl'

  if (!window.cardano || !window.cardano[wallet]) {
    alert("wallet not installed");
    return;
  }

  try {
    const api = await window.cardano[wallet].enable();
    const usedAddresses = await api.getUsedAddresses();

    if (!usedAddresses || usedAddresses.length === 0) {
      alert("addresses not found");
      return;
    }

    const hexAddress = usedAddresses[0];
    const addressBytes = Buffer.from(hexAddress, 'hex');
    const address = CardanoWasm.Address.from_bytes(addressBytes);
    const bech32Address = address.to_bech32();

    let pubKeyHash = 'not-available';

    const baseAddr = CardanoWasm.BaseAddress.from_address(address);
    if (baseAddr) {
      const paymentCred = baseAddr.payment_cred();
      const keyHash = paymentCred.to_keyhash();
      if (keyHash) {
        pubKeyHash = Buffer.from(keyHash.to_bytes()).toString('hex');
      }
    }

    document.getElementById('address').textContent =
      `Address: ${bech32Address}\nPubKeyHash: ${pubKeyHash}`;
  } catch (error) {
    console.error("error connection wallet:", error);
    alert("error connecting wallet");
  }
});
