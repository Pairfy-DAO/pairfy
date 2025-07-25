import {
  applyParamsToScript,
  applyDoubleCborEncoding,
  fromText,
  Data,
  SpendingValidator,
  validatorToAddress,
  Lucid,
  Network,
  validatorToScriptHash
} from "@lucid-evolution/lucid";
import { deserializeParams, provider, validators } from "./index.js";
import { sumLovelaceFromUtxos } from "./utils.js";

/**Generates a CBOR transaction to be signed and sent in the browser by the seller*/
async function finishedTransactionBuilder(
  operatorWalletAddress: string,
  serializedParams: string
) {
  let NETWORK: Network = "Preprod";

  if (!process.env.NETWORK_ENV) {
    throw new Error("NETWORK_ENV unset");
  }

  if (process.env.NETWORK_ENV === "Mainnet") {
    NETWORK = "Mainnet";
  }

  //////////////////////////////////////////////////

  const lucid = await Lucid(provider, NETWORK);

  //////////////////////////////////////////////////

  const timestamp = Date.now();

  const validFrom = timestamp - 1 * 60 * 1000;

  const validToMs = Number(
    BigInt(timestamp) + BigInt(process.env.TX_VALID_TIME as string)
  );

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

  const externalWalletUtxos = await lucid.utxosAt(operatorWalletAddress);

  lucid.selectWallet.fromAddress(operatorWalletAddress, externalWalletUtxos);

  //////////////////////////////////////////////////

  const totalLovelace = sumLovelaceFromUtxos(externalWalletUtxos);

  const txCollateral = 2_000_000n;

  const minLovelace = txCollateral;

  if (totalLovelace < minLovelace) {
    throw new Error("MIN_LOVELACE");
  }

  ///////////////////////////////////////////////////

  const StateMachineDatum = Data.Object({
    state: Data.Integer(),
    delivery: Data.Nullable(Data.Integer()),
  });

  type DatumType = Data.Static<typeof StateMachineDatum>;

  const DatumType = StateMachineDatum as unknown as DatumType;

  //////////////////////////////////////////////////

  const threadTokenUnit = stateMachineParams[0] + fromText("threadtoken");

  const stateMachineUtxo = await lucid.utxoByUnit(threadTokenUnit);

  console.log(stateMachineUtxo);

  if (stateMachineUtxo.datum) {
    const data = Data.from(stateMachineUtxo.datum, StateMachineDatum);
    console.log(data);

    const rule1 = [-1n,-2n,4n].includes(data.state)

    if (!rule1) {
      throw new Error("WRONG_STATE OR DEADLINE");
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

  console.log(stateMachineAddress);

  ////////////////////////////////////////////

  const finishedInput = "Finish";

  const StateMachineInput = Data.Enum([
    Data.Literal("Return"),
    Data.Literal("Lock"),
    Data.Literal("Cancel"),
    Data.Object({
      Shipped: Data.Object({
        delivery_param: Data.Integer(),
      }),
    }),
    Data.Literal("Appeal"),
    Data.Literal("Received"),
    Data.Literal("Collect"),
    Data.Literal("Finish"),
  ]);

  type InputType = Data.Static<typeof StateMachineInput>;

  const InputType = StateMachineInput as unknown as InputType;

  const stateMachineRedeemer = Data.to(finishedInput, InputType);

  ///////////////////////////////////////////

  const lovelaceToOperator = BigInt(1116290);

  console.log(lovelaceToOperator);

  console.log(validatorToScriptHash(stateMachineScript));

  const transaction = await lucid
    .newTx()
    .attach.SpendingValidator(stateMachineScript)
    .collectFrom([stateMachineUtxo], stateMachineRedeemer)
    .collectFrom(externalWalletUtxos)
    .pay.ToAddress(
      operatorWalletAddress,
      {
        [threadTokenUnit]: 1n,
        lovelace: lovelaceToOperator,
      }
    )
    .addSigner(operatorWalletAddress)
    .validFrom(validFrom)
    .validTo(validToMs)
    .complete({
      changeAddress: operatorWalletAddress,
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
  const operatorWalletAddress =
    "addr1q8nwn9q7y9gqh0t8syzm260gz5vha8udumnm4pvvvcnwcvtghsgxwcqg3fl6p5sh2awz40e4lg02r97ps5sqvezc76ws2x689e";

  const serializedParams =
    "c1ae188080924df3a9ed0d93798375978400a4f94a98ed71ca002b66,e6e9941e21500bbd678105b569e815197e9f8de6e7ba858c6626ec31,f01c268c791d627b59a02fb293ba423038e97b23ed88a3d37ffa203c,e6e9941e21500bbd678105b569e815197e9f8de6e7ba858c6626ec31,11250000,1125000,1753477743985,1753564143985,1758748143985";

  const BUILDER = await finishedTransactionBuilder(
    operatorWalletAddress,
    serializedParams
  );

  console.log("CBOR---------------------------------------");

  console.log("Unit: ", BUILDER.threadTokenUnit);

  console.log("stateMachineAddress: ", BUILDER.stateMachineAddress);

  console.log("CBOR---------------------------------------");

  console.log(BUILDER.cbor);
}

main();

export { finishedTransactionBuilder };
