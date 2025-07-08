import { createMessage } from "./messages/createMessage.js";
import { getMessages } from "./messages/getMessages.js";

const newMessages = {
  subscribe: (_: any, args: any, context: any) => {
    try {
      const SESSION = args.session.split(":");

      const AGENT = context.agentData;

      let channel = "";

      if (AGENT.role === "USER") {
        channel = `chat:channel:${SESSION[0]}:${AGENT.userData?.pubkeyhash}:${SESSION[2]}`;
      }

      if (AGENT.role === "SELLER") {
        channel = `chat:channel:${SESSION[0]}:${SESSION[1]}:${AGENT.sellerData?.id}`;
      }

      return context.pubsub.asyncIterator(channel);
    } catch (error) {
      console.error("Subscription error", error);
      throw new Error("Subscription error");
    }
  },
};

export const messages = {
  Query: {
    getMessages,
  },
  Mutation: {
    createMessage,
  },
  Subscription: {
    newMessages,
  },
};
