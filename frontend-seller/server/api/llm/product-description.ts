import { throwRemoteError } from "~/server/utils/fetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const response = await fetch(
      config.serviceLlmBase + "/api/llm/product-description",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": event.context.clientIP,
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (!response.ok || !response.body) {
      const text = await response.text();
      console.error("[LLM Stream Error]", response.status, text);
      throw new Error(`Remote LLM error: ${text}`);
    }

    setResponseHeader(event, "Content-Type", "text/plain");

    return sendStream(event, response.body);
  } catch (err: any) {
    throwRemoteError(err);
  }
});
