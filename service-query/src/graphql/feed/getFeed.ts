import { GraphQLError } from 'graphql';
import { redisFeedClient } from '../../database/redis.js';

export const getFeed = async () => {
  try {
    const result = await redisFeedClient.client.get("feed:timeline");

    if (!result) {
        throw new GraphQLError("No timeline data available.", {
          extensions: { code: "FEED_TIMELINE_EMPTY" },
        });
      }

    return result;

  } catch (err) {
    throw err
  }
};

