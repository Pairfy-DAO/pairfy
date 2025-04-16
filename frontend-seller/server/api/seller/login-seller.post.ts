export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  try {
    const response = await $fetch(
      `${config.serviceSellerBase}/seller/login-seller`,
      {
        method: "POST",
        body,
        credentials: "include",
        headers: {
          cookie: getHeader(event, "cookie") || "",
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
