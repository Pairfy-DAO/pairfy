// server/api/stream.ts
import { createClient } from "redis";

import { defineEventHandler, createEventStream } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const channel = query.channel;
  if (!channel || typeof channel !== "string") {
    throw createError({
      statusCode: 400,
      message: "Missing or invalid channel",
    });
  }
  const stream = createEventStream(event);

  const pingInterval = setInterval(() => {
    stream.push(JSON.stringify({ listen: true }));
  }, 10_000);

  const config = useRuntimeConfig();

  const subscriber = createClient({ url: config.redisChatBase });

  subscriber.on("error", console.error);

  await subscriber.connect();

  await subscriber.subscribe(`channel:${channel}`, (message) => {
    stream.push(message);
  });

  stream.onClosed(async () => {
    clearInterval(pingInterval);
    await subscriber.quit();
  });

  return stream.send();
});
