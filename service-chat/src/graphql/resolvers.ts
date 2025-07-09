import { createMessage } from "./messages/createMessage.js";
import { getMessages } from "./messages/getMessages.js";

export const messages = {
  Query: {
    getMessages,
  },
  Mutation: {
    createMessage,
  }
};
