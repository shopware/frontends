import type { ApiClient, operations } from "#shopware";

export type FormsClient = Pick<ApiClient, "invoke">;

export type ContactFormBody =
  operations["sendContactMail post /contact-form"]["body"];

type ContactFormAnswer = {
  individualSuccessMessage?: unknown;
} | null;

export async function sendContactForm(
  client: FormsClient,
  body: ContactFormBody,
): Promise<string | null> {
  const { data } = await client.invoke("sendContactMail post /contact-form", {
    body,
  });
  const message = (data as ContactFormAnswer | undefined)
    ?.individualSuccessMessage;
  return typeof message === "string" && message.trim() ? message.trim() : null;
}
