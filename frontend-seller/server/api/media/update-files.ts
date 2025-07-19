import { readMultipartFormData, defineEventHandler, parseCookies } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);
  const sessionCookie = cookies.session;

  const parts = await readMultipartFormData(event);
  if (!parts?.length) throw new Error("No form data received");

  const form = new FormData();

  for (const part of parts) {
    if (part.name === "files" && Buffer.isBuffer(part.data)) {
      const blob = new Blob([part.data], {
        type: part.type || "application/octet-stream",
      });
      form.append("files", blob, part.filename);
    } else if (part.name === "fileIds") {

      const fileIds = JSON.parse(part.data.toString()); 

      fileIds.forEach((id: string) => {
        form.append("fileIds[]", id);
      });
     
    } else if (part.name === "mediaGroupId") {
      form.append("mediaGroupId", part.data.toString());
    }
  }

  try {
    return await $fetch(config.serviceMediaBase + "/api/media/update-files", {
      method: "POST",
      body: form,
      headers: {
        'x-forwarded-for': event.context.clientIP,
        'cookie': sessionCookie ? `session=${sessionCookie}` : "",
      },
      async onResponseError({ response }) {
        throw new Error(
          JSON.stringify(response._data || "Unknown server error")
        );
      },
    });
  } catch (err: any) {
    throwRemoteError(err);
  }
});
