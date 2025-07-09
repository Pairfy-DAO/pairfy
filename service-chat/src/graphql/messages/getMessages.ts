export const getMessages = async (_: any, args: any, context: any) => {
  try {
    const { userData: USER, sellerData: SELLER } = context;

    const params = args.getMessagesInput;

    const chatKey = `chat:${params.session}`;
    const seenKey = `chat:seen:${params.session}`;

    let sender = "";

    if (USER) {
      sender = USER.pubkeyhash;
    }

    if (SELLER) {
      sender = SELLER.id;
    }

    const rawMessages = await context.redisClient.lRange(chatKey, 0, -1);
    const messages = rawMessages.map((msg: any) => JSON.parse(msg));

    const partyMessages = messages.filter((msg: any) => msg.sender !== sender);

    await Promise.all(
      partyMessages.map((item: any) =>
        context.redisClient.sAdd(seenKey, item.id)
      )
    );
    const seen = await context.redisClient.sMembers(seenKey);

    return {
      success: true,
      message: "OK",
      data: {
        messages,
        seen,
      },
    };
  } catch (err: any) {
    throw err;
  }
};
