export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  try {
    const response = await $fetch(
      config.serviceSellerBase + "/api/seller/recovery-seller",
      {
        method: "POST",
        body,
        credentials: "include",
        headers: {
          'x-forwarded-for': event.context.clientIP,
          'cookie': getHeader(event, "cookie") || "",
        },
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data));
        },
      }
    );

    return response;
  } catch (err: any) {
    throwRemoteError(err);
  }
});
