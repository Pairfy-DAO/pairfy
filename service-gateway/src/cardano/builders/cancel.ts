import {
  applyParamsToScript,
  applyDoubleCborEncoding,
  fromText,
  Data,
  SpendingValidator,
  validatorToAddress,
  Lucid,
  Network,
} from "@lucid-evolution/lucid";
import { deserializeParams, provider, validators } from "./index.js";
import { DatumType, InputType, } from "./types.js";


/**Generates a CBOR transaction to be signed and sent in the browser by the buyer to return funds after shipping_until. */
async function cancelTransactionBuilder(
  externalWalletAddress: string,
  serializedParams: string
) {
  //////////////////////////////////////////////////

  let NETWORK: Network = "Preprod";

  if (!process.env.NETWORK_ENV) {
    throw new Error("NETWORK_ENV unset");
  }

  if (process.env.NETWORK === "Mainnet") {
    NETWORK = "Mainnet";
  }

  //////////////////////////////////////////////////

  const lucid = await Lucid(provider, NETWORK);

  //////////////////////////////////////////////////

  const now = BigInt(Date.now());

  const validToMs = Number(now + BigInt(process.env.TX_VALID_TIME as string));

  //////////////////////////////////////////////////
  /**
   *
   *  @type {string} threadTokenPolicyId 0
   *  @type {string} operatorPubKeyHash 1
   *  @type {string} sellerPubKeyHash 2
   *  @type {string} buyerPubKeyHash 3
   *  @type {number} contractPrice 4
   *  @type {number} contractFee 5
   *  @type {number} pendingUntil 6
   *  @type {number} shippingUntil 7
   *  @type {number} expireUntil 8
   */
  const stateMachineParams = deserializeParams(serializedParams);

  //////////////////////////////////////////////////

  if (now < BigInt(stateMachineParams[7])) {
    throw new Error("BEFORE_DEADLINE");
  }

  //////////////////////////////////////////////////
  
  const externalWalletUtxos = await lucid.utxosAt(externalWalletAddress);

  lucid.selectWallet.fromAddress(externalWalletAddress, externalWalletUtxos);

  //////////////////////////////////////////////////

  const txCollateral = 2_000_000n;

  const minLovelace = txCollateral;

  const findIndex = externalWalletUtxos.findIndex(
    (item) => item.assets.lovelace > minLovelace
  );

  const externalWalletUtxo = externalWalletUtxos[findIndex];

  if (!externalWalletUtxo) {
    throw new Error("MIN_LOVELACE");
  }

  //////////////////////////////////////////////////

  const threadTokenUnit = stateMachineParams[0] + fromText("threadtoken");

  const stateMachineUtxo = await lucid.utxoByUnit(threadTokenUnit);

  console.log(stateMachineUtxo);

  if (stateMachineUtxo.datum) {
    const data = Data.from(stateMachineUtxo.datum, DatumType);

    console.log(data);

    if (data.state !== 1n) {
      throw new Error("WRONG_STATE");
    }
  }

  ///////////////////////////////////////

  const stateMachineScript: SpendingValidator = {
    type: "PlutusV3",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validators.stateMachine),
      [
        stateMachineParams[0],
        stateMachineParams[1],
        stateMachineParams[2],
        stateMachineParams[3],
        BigInt(stateMachineParams[4]),
        BigInt(stateMachineParams[5]),
        BigInt(stateMachineParams[6]),
        BigInt(stateMachineParams[7]),
        BigInt(stateMachineParams[8]),
      ]
    ),
  };

  const stateMachineAddress = validatorToAddress(NETWORK, stateMachineScript);

  ////////////////////////////////////////////

  const stateMachineRedeemer = Data.to("Cancel", InputType);

  ///////////////////////////////////////////

  const datumValues = {
    state: BigInt(-2),
    delivery: null,
  };

  const stateMachineDatum = Data.to(datumValues, DatumType);

  ///////////////////////////////////////////

  const lovelaceToBuyer = BigInt(stateMachineParams[4]);

  const transaction = await lucid
    .newTx()
    .collectFrom([stateMachineUtxo], stateMachineRedeemer)
    .collectFrom([externalWalletUtxo])
    .pay.ToAddressWithData(
      stateMachineAddress,
      {
        kind: "inline",
        value: stateMachineDatum,
      },
      {
        [threadTokenUnit]: 1n,
        lovelace: 0n,
      }
    )
    .pay.ToAddress(externalWalletAddress, {
      lovelace: lovelaceToBuyer,
    })
    .attach.SpendingValidator(stateMachineScript)
    .addSigner(externalWalletAddress)
    .validFrom(Date.now())
    .validTo(validToMs)
    .complete({
      changeAddress: externalWalletAddress,
      setCollateral: txCollateral,
      coinSelection: false,
      localUPLCEval: false,
    });

  const cbor = transaction.toCBOR();

  return {
    threadTokenUnit,
    stateMachineAddress,
    cbor,
  };
}

async function main() {
  const externalWalletAddress =
    "addr_test1qz3rnekzh0t2nueyn4j6lmufc28pgu0dqlzjnmqxsjxvzs24qtjuxnphyqxz46t40nudnm3kxu8hkau2mq6nw7svg7jswruwy3";

  const serializedParams =
    "736c50c15fe708374b1728f5b317004a7d9315df8175935528b3faf3,659fa0cf862b8460989af5f1200118a910ca04ae31b65aaa767d2b65,a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141,30000000,10000000,1734125149325";

  console.log(deserializeParams(serializedParams));

  const BUILDER = await cancelTransactionBuilder(
    externalWalletAddress,
    serializedParams
  );

  console.log("CBOR---------------------------------------");

  console.log("Unit: ", BUILDER.threadTokenUnit);

  console.log("stateMachineAddress: ", BUILDER.stateMachineAddress);

  console.log("CBOR---------------------------------------");

  console.log(BUILDER.cbor);
}

//main();

export { cancelTransactionBuilder };
