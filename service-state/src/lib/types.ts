import { Data } from "@lucid-evolution/lucid";
import { z } from "zod";

export const StateMachineDatum = Data.Object({
  state: Data.Integer(),
  delivery: Data.Nullable(Data.Integer()),
});

export type DatumType = typeof StateMachineDatum;

export type DatumTypeStatic = Data.Static<typeof StateMachineDatum>;
////////////////////////////////////////////////////////////////////////

export type OutputAmount = {
  unit: string;
  quantity: string;
};

export type Transaction = {
  hash: string;
  block: string;
  block_height: number;
  block_time: number;
  slot: number;
  index: number;
  output_amount: OutputAmount[];
  fees: string;
  deposit: string;
  size: number;
  invalid_before: string | null;
  invalid_hereafter: string | null;
  utxo_count: number;
  withdrawal_count: number;
  mir_cert_count: number;
  delegation_count: number;
  stake_cert_count: number;
  pool_update_count: number;
  pool_retire_count: number;
  asset_mint_or_burn_count: number;
  redeemer_count: number;
  valid_contract: boolean;
};

export type MetadataItem = {
  label: string;
  json_metadata: {
    msg: string[];
  };
};

export type MetadataList = MetadataItem[];

const OutputAmountSchema = z.object({
  unit: z.string(),
  quantity: z.string(),
});

export const TransactionSchema = z.object({
  hash: z.string(),
  block: z.string(),
  block_height: z.number(),
  block_time: z.number(),
  slot: z.number(),
  index: z.number(),
  output_amount: z.array(OutputAmountSchema),
  fees: z.string(),
  deposit: z.string(),
  size: z.number(),
  invalid_before: z.string().nullable(),
  invalid_hereafter: z.string().nullable(),
  utxo_count: z.number(),
  withdrawal_count: z.number(),
  mir_cert_count: z.number(),
  delegation_count: z.number(),
  stake_cert_count: z.number(),
  pool_update_count: z.number(),
  pool_retire_count: z.number(),
  asset_mint_or_burn_count: z.number(),
  redeemer_count: z.number(),
  valid_contract: z.boolean(),
});



const MetadataItemSchema = z.object({
  label: z.string(),
  json_metadata: z.object({
    msg: z.array(z.string())
  })
});

export const MetadataListSchema = z.array(MetadataItemSchema);