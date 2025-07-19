import { throwRemoteError } from "~/server/utils/fetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  try {
    const response = await $fetch(
      config.serviceSellerBase + "/api/seller/update-password",
      {
        method: "POST",
        body,
        headers: {
          "x-forwarded-for": event.context.clientIP,
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
