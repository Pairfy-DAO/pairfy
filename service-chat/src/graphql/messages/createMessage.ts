import { getMessageId } from "@pairfy/common";

export const createMessage = async (_: any, args: any, context: any) => {
  try {
    const { userData: USER, sellerData: SELLER } = context;

    const params = args.createMessageInput;

    const chatKey = `chat:${params.session}`;

    const channelKey = `channel:${params.session}`;

    let scheme = {
      id: getMessageId(),
      sender: "",
      role: "",
      message: params.content,
      seen: false,
      created_at: Date.now(),
    };

    if (USER) {
      scheme.sender = USER.pubkeyhash;
      scheme.role = "USER";
    }

    if (SELLER) {
      scheme.sender = SELLER.id;
      scheme.role = "SELLER";
    }

    await context.redisClient.lPush(chatKey, JSON.stringify(scheme));

    await context.pubSub.publish(channelKey, { message: scheme });

    console.log(scheme);

    return {
      success: true,
      message: "OK",
    };
  } catch (err: any) {
    throw err;
  }
};
