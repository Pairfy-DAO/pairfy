// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type Script } from "@blaze-cardano/core";
import { applyParamsToScript, cborToScript } from "@blaze-cardano/uplc";

export interface MarketplaceStatemachine {
  new (threadtoken: string): Script;
  datum: {
    state: bigint;
    seller: string;
    collateral: bigint;
    price: bigint;
    buyer: string | null;
  };
  redeemer: { Locking: { buyer: string } } | "Delivered" | "Received";
}

export const MarketplaceStatemachine = Object.assign(
  function (threadtoken: string) {
    return cborToScript(
      applyParamsToScript(
        "5904300100003232323232323223223232322322533300a3232533300c3007300d375400226464646464646464646464a66602e602660306ea80244c8c8c8c8c8c8c8c94ccc07cc06cc080dd500089919192999811180f18119baa001132323232533302600e1533302600b1533302600215333026003100114a029405280a503375e66e952004330293009330294c01010100330293752024660526ea0040cc0a4dd4007998149804998149ba900e4bd7025eb812f5c0600a604e6ea800ccdc4807192999812981018131baa0011480004dd6981518139baa0013253330253020302637540022980103d87a8000132330010013756605660506ea8008894ccc0a8004530103d87a8000132323232533302b33722911000021533302b3371e9101000021300f3302f375000297ae014c0103d87a8000133006006003375a60580066eb8c0a8008c0b8008c0b0004c8cc004004dd5980d98139baa00322533302900114c103d87a8000132323232533302a33722911000021533302a3371e9101000021300e3302e374c00297ae014c0103d87a8000133006006003375660560066eb8c0a4008c0b4008c0ac004cc024c8cc004004dd5980d18131baa00222533302800114bd7009981498131815000998010011815800810981398121baa00116330043758600260466ea8c020c08cdd500c119baf300930243754002601260486ea8c060c090dd50019181318139813800981218109baa00116330013758600a60406ea8c014c080dd500a919baf30063021375400202644646600200200644a666048002298103d87a8000132325333023300500213007330270024bd70099802002000981400118130009ba548000cc004dd6181018109810981098109810981098109810980e9baa3002301d375402400844646600200200644a66604200229404c94ccc07ccdc79bae302400200414a226600600600260480024603e002602800e6eb8c070c064dd5004899299980c1809980c9baa00a14a2264944dd6980e980d1baa009375a603860326ea8020dd6980d980e0011bad301a001301a002375c603000260300046eb4c058004c048dd5000980a0011809980a000998088051980880325eb80c044c038dd50008a503001300d375400446020602200229309b2b192999804980280089919299980718088010a4c2c6eb8c03c004c02cdd50010a99980498020008a99980618059baa00214985854ccc024cdc3a40080022a66601860166ea8008526161630093754002a66600c6004600e6ea800c4c8c8c8c8c8c8c8c8c8c94ccc04cc0580084c926325333011300d0011323253330163019002149858dd7180b80098099baa00215333011300c00115333014301337540042930b0b18089baa0011630140013014002375a602400260240046eb4c040004c040008dd7180700098070011bad300c001300837540062c6e1d2002370e90001bae0015734aae7555cf2ab9f5740ae855d11",
        [threadtoken],
        { "dataType": "list", "items": [{ "dataType": "bytes" }] } as any,
      ),
      "PlutusV2",
    );
  },
  {
    datum: {
      "title": "StateMachineDatum",
      "anyOf": [{
        "title": "StateMachineDatum",
        "dataType": "constructor",
        "index": 0,
        "fields": [
          { "dataType": "integer", "title": "state" },
          { "dataType": "bytes", "title": "seller" },
          { "dataType": "integer", "title": "collateral" },
          { "dataType": "integer", "title": "price" },
          {
            "title": "buyer",
            "anyOf": [{
              "title": "Some",
              "description": "An optional value.",
              "dataType": "constructor",
              "index": 0,
              "fields": [{ "dataType": "bytes" }],
            }, {
              "title": "None",
              "description": "Nothing.",
              "dataType": "constructor",
              "index": 1,
              "fields": [],
            }],
          },
        ],
      }],
    },
  },
  {
    redeemer: {
      "title": "StateMachineInput",
      "anyOf": [{
        "title": "Locking",
        "dataType": "constructor",
        "index": 0,
        "fields": [{ "dataType": "bytes", "title": "buyer" }],
      }, {
        "title": "Delivered",
        "dataType": "constructor",
        "index": 1,
        "fields": [],
      }, {
        "title": "Received",
        "dataType": "constructor",
        "index": 2,
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
