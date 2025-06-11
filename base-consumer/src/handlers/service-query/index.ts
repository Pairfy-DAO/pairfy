import { CreateProduct } from "./CreateProduct.js";
import { CreateMedia } from "./CreateMedia.js";
import { UpdateProduct } from "./UpdateProduct.js";
import { DeleteProduct } from "./DeleteProduct.js";

const handlers: any = {
    CreateProduct,
    CreateMedia,
    UpdateProduct,
    DeleteProduct
  };
  
  export const processEvent = (message: any) => {
    const messageDecoded = new TextDecoder().decode(message.data);
  
    const event = JSON.parse(messageDecoded);
  
    console.log(message.seq, event.id, event.type);
  
    return handlers[event.type](event, message.seq);
  };
  