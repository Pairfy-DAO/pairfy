import { getMessageId } from "@pairfy/common";

export const createMessage = async (_: any, args: any, context: any) => {
  try {
    const { userData: USER, sellerData: SELLER } = context;

    const params = args.createMessageInput;

    const SESSION = params.session.split(":");

    const ORDER = SESSION[0];

    let chatKey = "";

    let channelKey = "";

    let scheme = {
      id: getMessageId(),
      agent: "",
      role: "",
      content: params.content,
      seen: false,
      created_at: Date.now(),
    };

    if (USER) {
      scheme.agent = USER.pubkeyhash;
      scheme.role = "buyer";
      chatKey = `chat:${ORDER}:${scheme.agent}:${SESSION[2]}`;
      channelKey = `chat:channel:${ORDER}:${scheme.agent}:${SESSION[2]}`;
    }

    if (SELLER) {
      scheme.agent = SELLER.id;
      scheme.role = "seller";
      chatKey = `chat:${ORDER}:${SESSION[1]}:${scheme.agent}`;
      channelKey = `chat:channel:${ORDER}:${SESSION[1]}:${scheme.agent}`;
    }

    await context.redisClient.zAdd(chatKey, {
      score: Date.now(),
      value: JSON.stringify(scheme),
    });

    await context.pubsub.publish(channelKey, { newMessages: scheme });
    
    console.log(scheme);

    return {
      success: true,
      message: "OK",
    };
  } catch (err: any) {
    throw err;
  }
};
