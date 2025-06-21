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
import { DatumType, InputType } from "./types.js";

/**Generates a CBOR transaction to be signed and sent in the browser by the seller to send before shipping_until. */
async function shippingTransactionBuilder(
  externalWalletAddress: string,
  serializedParams: string,
  deliveryDate: bigint,
  metadata: any
) {
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

  if (deliveryDate <= BigInt(stateMachineParams[7])) {
    throw new Error("Invalid Delivery Date");
  }

  if (deliveryDate >= BigInt(stateMachineParams[8])) {
    throw new Error("Delivery Date Limit");
  }

  const appealWindow =
    deliveryDate + BigInt(process.env.APPEAL_RANGE as string);

  if (appealWindow >= BigInt(stateMachineParams[8])) {
    throw new Error("Delivery Date Limit");
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

  const shippingInput = {
    Shipped: {
      delivery_param: BigInt(deliveryDate),
    },
  };

  const stateMachineRedeemer = Data.to(shippingInput, InputType);

  ////////////////////////////////////////////

  const datumValues = {
    state: BigInt(2),
    delivery: BigInt(deliveryDate),
  };

  const stateMachineDatum = Data.to(datumValues, DatumType);

  ////////////////////////////////////////////

  const lovelaceToSM = BigInt(stateMachineParams[4]);

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
        lovelace: lovelaceToSM,
      }
    )
    .attach.SpendingValidator(stateMachineScript)
    .addSigner(externalWalletAddress)
    .validFrom(Date.now())
    .validTo(validToMs)
    .attachMetadata(777, metadata)
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
    "0a09d13dacc36caa75855765930e3f93f840f7e07ea72b05fe31ece2,a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141,746bff9fb367bf3bb1b25fe24a272bb288d62a2cad1aad2e37a8173f,30000000,10000000,1734559401711";

  const metadata = { msg: "what" };

  const deliveryDate = BigInt(Date.now()); ///parametrized

  const BUILDER = await shippingTransactionBuilder(
    externalWalletAddress,
    serializedParams,
    deliveryDate,
    metadata
  );

  console.log("CBOR---------------------------------------");

  console.log("Unit: ", BUILDER.threadTokenUnit);

  console.log("stateMachineAddress: ", BUILDER.stateMachineAddress);

  console.log("CBOR---------------------------------------");

  console.log(BUILDER.cbor);
}

//main();

export { shippingTransactionBuilder };

//two signature, collateral, validto, paramterice price, collateral, seller, buyer
