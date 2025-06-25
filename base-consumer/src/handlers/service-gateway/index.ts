import { CreateProduct } from "./CreateProduct.js";
import { UpdateProduct } from "./UpdateProduct.js";
import { DeleteProduct } from "./DeleteProduct.js";
import { UpdateSeller } from "./UpdateSeller.js";
import { CreateSeller } from "./CreateSeller.js";
import { redisBooksClient } from "./utils/redis.js";

const handlers: any = {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  CreateSeller,
  UpdateSeller,
};

await redisBooksClient
  .connect({
    service: "service-gateway-consumer",
    url: process.env.HANDLER_REDIS_BOOKS_HOST,
    connectTimeout: 100000,
    keepAlive: 100000,
  })
  .then(() => console.log("redisBooksClient connected"))
  .catch((err: any) => console.error("redisBooksError", err));

export const processEvent = (message: any) => {
  const messageDecoded = new TextDecoder().decode(message.data);

  const event = JSON.parse(messageDecoded);

  console.log(message.seq, event.id, event.type);

  return handlers[event.type](event, message.seq);
};
