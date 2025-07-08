export const getMessages = async (_: any, args: any, context: any) => {
  try {
    const params = args.getMessagesInput;

    const SESSION = params.session.split(":");

    const seenKey = `chat:seen:${SESSION[0]}`;

    let chatKey = "";

    let ownerId = "";

    if (context.userData) {
      chatKey = `chat:${SESSION[0]}:${context.userData.pubkeyhash}:${SESSION[2]}`;
      ownerId = context.userData.pubkeyhash;
    }

    if (context.sellerData) {
      chatKey = `chat:${SESSION[0]}:${SESSION[1]}:${context.sellerData.id}`;
      ownerId = context.sellerData.id;
    }

    const getMessages = await context.redisClient.zRange(chatKey, 0, -1);

    const messages = getMessages.map(JSON.parse);

    const partyMessages = messages.filter(
      (message: any) => message.agent !== ownerId
    );

    for (const item of partyMessages) {
      await context.redisClient.HSETNX(seenKey, item.id, "true");
    }

    const seen = await context.redisClient.HGETALL(seenKey);

    return {
      messages,
      seen: JSON.stringify({ ...seen }),
    };
  } catch (err: any) {
    throw err;
  }
};