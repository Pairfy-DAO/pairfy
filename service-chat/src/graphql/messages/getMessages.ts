export const getMessages = async (_: any, args: any, context: any) => {
  try {
    const { userData: USER, sellerData: SELLER } = context;

    const params = args.getMessagesInput;

    const SESSION = params.session.split(":");

    const ORDER = SESSION[0];

    let chatKey = "";

    let ownerId = "";

    if (USER) {
      chatKey = `chat:${ORDER}:${USER.pubkeyhash}:${SESSION[2]}`;
      ownerId = USER.pubkeyhash;
    }

    if (SELLER) {
      chatKey = `chat:${ORDER}:${SESSION[1]}:${SELLER.id}`;
      ownerId = SELLER.id;
    }

    const getMessages = await context.redisClient.zRange(chatKey, 0, -1);

    const messages = getMessages.map(JSON.parse);

    const partyMessages = messages.filter(
      (message: any) => message.agent !== ownerId
    );

    const seenKey = `chat:seen:${ORDER}`;
    
    for (const item of partyMessages) {
      await context.redisClient.HSETNX(seenKey, item.id, "true");
    }
    const seen = await context.redisClient.HGETALL(seenKey);

    console.log({ ...seen });

    return {
      success: true,
      message: "OK",
      data: {
        messages,
        seen: { ...seen },
      },
    };
  } catch (err: any) {
    throw err;
  }
};
