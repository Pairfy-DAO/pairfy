// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type Script } from "@blaze-cardano/core";
import { applyParamsToScript, cborToScript } from "@blaze-cardano/uplc";

export interface MarketplaceStatemachine {
  new (threadtoken: string): Script;
  datum: { state: bigint; seller: string };
  redeemer:
    | "Waiting"
    | { Locking: { buyer: string } }
    | "Delivered"
    | "Received";
}

export const MarketplaceStatemachine = Object.assign(
  function (threadtoken: string) {
    return cborToScript(
      applyParamsToScript(
        "5902c70100003232323232323223223232232322533300a3232323232325333010300c3011375400a2646464a666026601e00a20042940c8ccc004004dd61801980a9baa3003301537540149000111299980c00108008999801801980d80119b80325333016300f301737540022900009bad301b3018375400264a66602c601e602e6ea80045300103d87a8000132330010013756603860326ea8008894ccc06c004530103d87a8000132323232533301c33722911000021533301c3371e91010000213374a9000198101ba80014bd700a6103d87a8000133006006003375a603a0066eb8c06c008c07c008c074004c8cc004004dd5991800980c9baa300130193754603800846038603a00244a666034002298103d87a8000132323232533301b33722911000021533301b3371e91010000213374a90001980f9ba60014bd700a6103d87a8000133006006003375660380066eb8c068008c078008c070004004c8cc004004dd6180b980c180c180c180c180c180c180c180c180a1baa30023014375401244a66602c00229404c94ccc050cdc79bae301900200514a226600600600260320024602c002264a666022601460246ea80184c9289bae30163013375400c264a66602466e1d20043013375400e29444c9289bad30173014375400c6eb4c058c04cdd50029bad3015301237540086eb8c050c054008dd6980980098079baa0013011002301030110013300e0073300e0044bd700a4c26cac64a666012600a0022a66601860166ea800c5261615333009300200113232533300e3011002149858dd7180780098059baa003153330093370e90020008a99980618059baa00314985854ccc024cdc3a400c0022a66601860166ea800c5261616300937540046e1d20025333005300130063754004264646464a666018601e0042930b1bae300d001300d002375a6016002600e6ea800858dc3a40006eb80055cd2ab9d5573caae7d5d02ba157441",
        [threadtoken],
        { "dataType": "list", "items": [{ "dataType": "bytes" }] } as any,
      ),
      "PlutusV2",
    );
  },
  {
    datum: {
      "title": "MachineStateDatum",
      "anyOf": [{
        "title": "MachineStateDatum",
        "dataType": "constructor",
        "index": 0,
        "fields": [{ "dataType": "integer", "title": "state" }, {
          "dataType": "bytes",
          "title": "seller",
        }],
      }],
    },
  },
  {
    redeemer: {
      "title": "MachineStateInput",
      "anyOf": [{
        "title": "Waiting",
        "dataType": "constructor",
        "index": 0,
        "fields": [],
      }, {
        "title": "Locking",
        "dataType": "constructor",
        "index": 1,
        "fields": [{ "dataType": "bytes", "title": "buyer" }],
      }, {
        "title": "Delivered",
        "dataType": "constructor",
        "index": 2,
        "fields": [],
      }, {
        "title": "Received",
        "dataType": "constructor",
        "index": 3,
        "fields": [],
      }],
    },
  },
) as unknown as MarketplaceStatemachine;

export interface MarketplaceThreadtoken {
  new (
    tokenName: string,
    utxoRef: { transactionId: { hash: string }; outputIndex: bigint },
  ): Script;
  redeemer: "Mint" | "Burn";
}

export const MarketplaceThreadtoken = Object.assign(
  function (
    tokenName: string,
    utxoRef: { transactionId: { hash: string }; outputIndex: bigint },
  ) {
    return cborToScript(
      applyParamsToScript(
        "5901f5010000323232323232322322232323225333009323232533300c3007300d3754002264646464a666026602c00426464a666024601a60266ea803854ccc048c034c04cdd5191980080080311299980b8008a60103d87a80001323253330163375e603660306ea800804c4cdd2a40006603400497ae0133004004001301b002301900115333012300c00113371e00402029405854ccc048cdc3800a4002266e3c0080405281bad3013002375c60220022c602800264a66601e601260206ea800452f5bded8c026eacc050c044dd500099191980080099198008009bab3016301730173017301700522533301500114bd6f7b630099191919299980b19b91488100002153330163371e9101000021003100513301a337606ea4008dd3000998030030019bab3017003375c602a0046032004602e00244a666028002298103d87a800013232323253330153372200e0042a66602a66e3c01c0084cdd2a4000660326e980052f5c02980103d87a80001330060060033756602c0066eb8c050008c060008c058004dd7180998081baa00337586024002601c6ea800858c040c044008c03c004c02cdd50008a4c26cac64a66601060060022a66601660146ea8010526161533300830020011533300b300a37540082930b0b18041baa003370e90011b8748000dd7000ab9a5573aaae7955cfaba05742ae89",
        [tokenName, utxoRef],
        {
          "dataType": "list",
          "items": [{ "dataType": "bytes" }, {
            "title": "OutputReference",
            "description":
              "An `OutputReference` is a unique reference to an output on-chain. The `output_index`\n corresponds to the position in the output list of the transaction (identified by its id)\n that produced that output",
            "anyOf": [{
              "title": "OutputReference",
              "dataType": "constructor",
              "index": 0,
              "fields": [{
                "title": "transactionId",
                "description":
                  "A unique transaction identifier, as the hash of a transaction body. Note that the transaction id\n isn't a direct hash of the `Transaction` as visible on-chain. Rather, they correspond to hash\n digests of transaction body as they are serialized on the network.",
                "anyOf": [{
                  "title": "TransactionId",
                  "dataType": "constructor",
                  "index": 0,
                  "fields": [{ "dataType": "bytes", "title": "hash" }],
                }],
              }, { "dataType": "integer", "title": "outputIndex" }],
            }],
          }],
        } as any,
      ),
      "PlutusV2",
    );
  },
  {
    redeemer: {
      "title": "ThreadTokenInput",
      "anyOf": [{
        "title": "Mint",
        "dataType": "constructor",
        "index": 0,
        "fields": [],
      }, {
        "title": "Burn",
        "dataType": "constructor",
        "index": 1,
        "fields": [],
      }],
    },
  },
) as unknown as MarketplaceThreadtoken;
