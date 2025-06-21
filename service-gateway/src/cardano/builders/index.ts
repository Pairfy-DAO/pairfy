import * as dotenv from "dotenv";
import { Kupmios } from "@lucid-evolution/lucid";
import { blueprint } from "./plutus.js";

dotenv.config();

const provider = new Kupmios(
  process.env.KUPO_KEY as string,
  process.env.OGMIOS_KEY as string,
);

type Validators = {
  threadToken: string;
  stateMachine: string;
};

function readValidators(): Validators {
  const threadToken = blueprint.validators.find(
    (v: any) => v.title === "marketplace.threadtoken.mint"
  );

  if (!threadToken) {
    throw new Error("threadToken validator not found");
  }

  const stateMachine = blueprint.validators.find(
    (v: any) => v.title === "marketplace.statemachine.spend"
  );

  if (!stateMachine) {
    throw new Error("stateMachine validator not found");
  }

  return {
    threadToken: threadToken.compiledCode,
    stateMachine: stateMachine.compiledCode,
  };
}


const validators = readValidators();

function serializeParams(array: any[]) {
  return array.join(",");
}

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
function deserializeParams(params: string) {
  return params.split(",");
}

export {
  provider,
  readValidators,
  validators,
  serializeParams,
  deserializeParams,
};
