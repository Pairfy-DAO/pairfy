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
    if (!import.meta.client) return;

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
  };

  const connect = async (name: string) => {
    if (!name) {
      console.error("walletStore: wallet name undefined");
    }

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

  const balanceTx = async (unbalancedTx: string) => {
    if (!import.meta.client) return;

    if (!walletApi.value) {
      throw new Error("There is no walletApi instance.");
    }

    const { $CSL } = useNuxtApp();

    const CardanoWasm: any = $CSL;

    const oldTx = CardanoWasm.Transaction.from_hex(unbalancedTx);

    console.log(
      "-----------------------------------------------------------------------------"
    );

    console.log("OLD BODY", oldTx.to_json());

    //////////////////////////////////////////////////////////////////////////   METADATA

    const generalMetadata =
      oldTx.auxiliary_data()?.metadata() ??
      CardanoWasm.GeneralTransactionMetadata.new();

    generalMetadata.insert(
      CardanoWasm.BigNum.from_str("674"),
      CardanoWasm.encode_json_str_to_metadatum(
        JSON.stringify({ message: "Hola desde Cardano!" }),
        0
      )
    );

    const newAuxData = CardanoWasm.AuxiliaryData.new();
    newAuxData.set_metadata(generalMetadata);

    console.log("METADATA", newAuxData.to_json());

    //////////////////////////////////////////////////////////////////////////

    const template = CardanoWasm.Transaction.new(
      oldTx.body(),
      oldTx.witness_set(),
      oldTx.auxiliary_data()
    );

    ////////////////////////////////////////////////////////////////////////// SIGNATURE

    let txVkeyWitnesses = await walletApi.value.signTx(
      Buffer.from(template.to_bytes()).toString("hex"),
      true
    );

    txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(
      Buffer.from(txVkeyWitnesses, "hex")
    );

    const newTransactionWitnessSet = template.witness_set();
    newTransactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    /////////////////////////////////////////////////////

    const newTx = CardanoWasm.Transaction.new(
      template.body(),
      newTransactionWitnessSet,
      template.auxiliary_data()
    );

    console.log(
      "/////////////////////////////////////////////////////////////////////////////////////////"
    );

    console.log("NEWBODY", newTx.to_json());

    return walletApi.value.submitTx(
      Buffer.from(newTx.to_bytes()).toString("hex")
    );
  };

  return {
    connected,
    walletApi,
    walletName,
    connect,
    sign,
    disconnect,
    balanceTx,
  };
});
