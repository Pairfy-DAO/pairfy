import { Data } from "@lucid-evolution/lucid";

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

///////////////////////////////////////////

const StateMachineDatum = Data.Object({
  state: Data.Integer(),
  delivery: Data.Nullable(Data.Integer()),
});

type DatumType = Data.Static<typeof StateMachineDatum>;

const DatumType = StateMachineDatum as unknown as DatumType;

export { InputType, DatumType };
