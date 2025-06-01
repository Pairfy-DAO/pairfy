import { throwRemoteError } from "~/server/utils/fetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const cookies = parseCookies(event);
  const sessionCookie = cookies.session;

  try {
    const response = await $fetch(
      `${config.serviceUserBase}/user/logout-user`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: sessionCookie ? `session=${sessionCookie}` : "",
        },
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data));
        }
      }
    )

    setCookie(event, "session", "", {});

    return response;
  } catch (err: any) {
    throwRemoteError(err);
  }
});
