import { defineStore } from "pinia";
import { Buffer } from "buffer";

export const useWalletStore = defineStore("wallet", () => {
  const connected = ref(false);
  const walletApi = ref<any>(null);
  const walletName = ref<string | null>(null);

  const getMessage = () => {
    const message = "PLEASE SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE"; //env variable

    return Buffer.from(message, "utf8").toString("hex");
  };

  const getAddress = async () => {
    if (!walletApi.value) {
      return;
    }

    const addresses = await walletApi.value.getUsedAddresses();

    return addresses?.[0] || null;
  };

  const signMessage = async () => {
    if (!walletApi.value) {
      return;
    }

    const address = await getAddress();

    const signature = await walletApi.value.signData(address, getMessage());

    return [signature, address];
  };

  const createWalletApiInstance = async (name: string) => {
    if (import.meta.client) {
      try {
        walletApi.value = await window.cardano[name]?.enable();

        if (!walletApi.value) {
          return;
        }

        const networkId = await walletApi.value?.getNetworkId(); // 0 = testnet, 1 = mainnet

        console.log(networkId);

        if (networkId !== 0) {
          throw new Error(
            "⚠️ Connection failed: Please switch your wallet to Testnet and try again."
          );
        }

        walletName.value = name;
        connected.value = true;
      } catch (error) {
        console.error("Error creating wallet instance", error);
        throw error;
      }
    }
  };

  const connect = async (name: string) => {
    if (!walletApi.value) {
      await createWalletApiInstance(name);
    }
  };

  const sign = async () => {
    try {
      if (!walletApi.value) {
        return;
      }

      return await signMessage();
    } catch (err: any) {
      throw err;
    }
  };

  const disconnect = () => {
    connected.value = false;
    walletApi.value = null;
    walletName.value = null;
  };

  return {
    connected,
    walletApi,
    walletName,
    connect,
    sign,
    disconnect,
  };
});
