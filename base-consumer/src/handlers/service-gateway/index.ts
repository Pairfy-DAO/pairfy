import { CreateProduct } from "./CreateProduct.js";
import { UpdateProduct } from "./UpdateProduct.js";
import { DeleteProduct } from "./DeleteProduct.js";
import { UpdateSeller } from "./UpdateSeller.js";
import { CreateSeller } from "./CreateSeller.js";

const handlers: any = {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  CreateSeller,
  UpdateSeller
};

export const processEvent = (message: any) => {
  const messageDecoded = new TextDecoder().decode(message.data);

  const event = JSON.parse(messageDecoded);

  console.log(message.seq, event.id, event.type);

  return handlers[event.type](event, message.seq);
};
