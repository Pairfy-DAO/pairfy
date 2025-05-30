import { throwRemoteError } from "~/server/utils/fetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);
  
  try {
    const response = await $fetch(
      `${config.serviceSellerBase}/seller/create-seller`,
      {
        method: "POST",
        body,
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
