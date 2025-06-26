import {
  applyParamsToScript,
  applyDoubleCborEncoding,
  Constr,
  mintingPolicyToId,
  MintingPolicy,
  fromText,
  Data,
  SpendingValidator,
  validatorToAddress,
  paymentCredentialOf,
  Lucid,
  Network,
} from "@lucid-evolution/lucid";
import { provider, serializeParams, validators } from "./index.js";

/**Generates a CBOR transaction to be signed and sent in the browser by the buyer. */
async function pendingTransactionBuilder(
  operatorPubKeyHash: string,
  externalWalletAddress: string,
  sellerPubKeyHash: string,
  contractPrice: bigint,
  fee: bigint
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

  const txValidTime = BigInt(process.env.TX_VALID_TIME as string);

  const txWatchWindow = BigInt(process.env.TX_WATCH_WINDOW as string);

  const pendingRange = BigInt(process.env.PENDING_RANGE as string);

  const shippingRange = BigInt(process.env.SHIPPING_RANGE as string);

  const expiringRange = BigInt(process.env.EXPIRING_RANGE as string);

  //////////////////////////////////////////////////

  const now = BigInt(Date.now());

  const validToMs = now + txValidTime;

  const watchUntil = now + txValidTime + txWatchWindow;

  const pendingUntil = now + txValidTime + txWatchWindow + pendingRange;

  const shippingUntil =
    now + txValidTime + txWatchWindow + pendingRange + shippingRange;

  const expireUntil =
    now +
    txValidTime +
    txWatchWindow +
    pendingRange +
    shippingRange +
    expiringRange;

  //////////////////////////////////////////////////

  const externalWalletUtxos = await lucid.utxosAt(externalWalletAddress);

  lucid.selectWallet.fromAddress(externalWalletAddress, externalWalletUtxos);

  const buyerPubKeyHash = paymentCredentialOf(externalWalletAddress).hash;

  //////////////////////////////////////////////////

  const txCollateral = 2_000_000n;

  const minLovelace = contractPrice + txCollateral;

  const findIndex = externalWalletUtxos.findIndex(
    (item) => item.assets.lovelace > minLovelace
  );

  const utxo = externalWalletUtxos[findIndex];

  if (!utxo) {
    throw new Error("MIN_LOVELACE");
  }

  const utxoRef = new Constr(0, [
    String(utxo.txHash),
    BigInt(utxo.outputIndex),
  ]);

  const tokenName = fromText("threadtoken");

  const threadTokenScript: MintingPolicy = {
    type: "PlutusV3",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validators.threadToken),
      [tokenName, utxoRef, validToMs]
    ),
  };

  const threadTokenPolicyId = mintingPolicyToId(threadTokenScript);

  const mintRedeemer = Data.to(new Constr(0, []));

  ///////////////////////////////////////

  const stateMachineParams = [
    threadTokenPolicyId,
    operatorPubKeyHash,
    sellerPubKeyHash,
    buyerPubKeyHash,
    contractPrice,
    fee,
    pendingUntil,
    shippingUntil,
    expireUntil,
  ];

  const serializedParams = serializeParams(stateMachineParams);

  const stateMachineScript: SpendingValidator = {
    type: "PlutusV3",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validators.stateMachine),
      stateMachineParams
    ),
  };

  ////////////////////////////////////////////

  const datumValues = {
    state: BigInt(0),
    delivery: null,
  };

  const StateMachineDatum = Data.Object({
    state: Data.Integer(),
    delivery: Data.Nullable(Data.Integer()),
  });

  type DatumType = Data.Static<typeof StateMachineDatum>;

  const DatumType = StateMachineDatum as unknown as DatumType;

  const stateMachineDatum = Data.to(datumValues, DatumType);

  const stateMachineAddress = validatorToAddress(NETWORK, stateMachineScript);

  ////////////////////////////////////////////

  const assetUnit = threadTokenPolicyId + tokenName;

  const transaction = await lucid
    .newTx()
    .collectFrom([utxo])
    .mintAssets(
      {
        [assetUnit]: 1n,
      },
      mintRedeemer
    )
    .pay.ToAddressWithData(
      stateMachineAddress,
      {
        kind: "inline",
        value: stateMachineDatum,
      },
      {
        [assetUnit]: 1n,
        lovelace: contractPrice,
      }
    )
    .attach.MintingPolicy(threadTokenScript)
    .addSigner(externalWalletAddress)
    .validTo(Number(validToMs))
    .complete({
      changeAddress: externalWalletAddress,
      setCollateral: txCollateral,
      coinSelection: false,
      localUPLCEval: false,
    });

  const cbor = transaction.toCBOR();

  return {
    threadTokenPolicyId,
    stateMachineAddress,
    serializedParams,
    assetUnit,
    cbor,
    watchUntil,
    pendingUntil,
    shippingUntil,
    expireUntil,
  };
}

async function main() {
  const operatorPubKeyHash =
    "a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141";

  const externalWalletAddress =
    "addr_test1qp6xhlulkdnm7wa3kf07yj389weg34329jk34tfwx75pw0urvzxsjpchzgnhfmvz35ap356vg3a2c2af34zl4va7cfzqtyf6jn";

  const sellerPubKeyHash =
    "a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141";

  const contractPrice = 30 * 1_000_000;

  const fee = 2_000_000;

  const BUILDER = await pendingTransactionBuilder(
    operatorPubKeyHash,
    externalWalletAddress,
    sellerPubKeyHash,
    BigInt(contractPrice),
    BigInt(fee)
  );

  console.log("--------------------------------------------------------");

  console.log("ThreadToken: ", BUILDER.threadTokenPolicyId);

  console.log("Unit: ", BUILDER.assetUnit);

  console.log("stateMachineAddress: ", BUILDER.stateMachineAddress);

  console.log("stateMachineParams: ", BUILDER.serializedParams);

  console.log("--------------------------------------------------------");

  console.log(BUILDER.cbor);
}

//main();

export { pendingTransactionBuilder };
