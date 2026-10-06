import type { ApiClient, Schemas, operations } from "#shopware";

export type ProfileClient = Pick<ApiClient, "invoke">;

export type ChangeProfileBody =
  operations["changeProfile post /account/change-profile"]["body"];

export type ChangeEmailBody =
  operations["changeEmail post /account/change-email"]["body"];

export type ChangePasswordBody =
  operations["changePassword post /account/change-password"]["body"];

export type NewsletterStatus = Schemas["NewsletterStatus"];

export type NewsletterSubscription = {
  email: string;
  storefrontUrl: string;
};

export const SUBSCRIBE_KEY = "subscribe";

const NOT_SUBSCRIBED: readonly NewsletterStatus[] = ["optOut", "undefined"];

export async function changeProfile(
  client: ProfileClient,
  body: ChangeProfileBody,
): Promise<void> {
  await client.invoke("changeProfile post /account/change-profile", { body });
}

export async function changeEmail(
  client: ProfileClient,
  { email, emailConfirmation, password }: ChangeEmailBody,
): Promise<void> {
  await client.invoke("changeEmail post /account/change-email", {
    body: { email, emailConfirmation, password },
  });
}

export async function changePassword(
  client: ProfileClient,
  { password, newPassword, newPasswordConfirm }: ChangePasswordBody,
): Promise<void> {
  await client.invoke("changePassword post /account/change-password", {
    body: { password, newPassword, newPasswordConfirm },
  });
}

export async function readNewsletterStatus(
  client: ProfileClient,
): Promise<NewsletterStatus> {
  const { data } = await client.invoke(
    "readNewsletterRecipient post /account/newsletter-recipient",
  );
  return data.status;
}

export async function subscribeNewsletter(
  client: ProfileClient,
  { email, storefrontUrl }: NewsletterSubscription,
): Promise<NewsletterStatus> {
  const { data } = await client.invoke(
    "subscribeToNewsletter post /newsletter/subscribe",
    { body: { email, option: SUBSCRIBE_KEY, storefrontUrl } },
  );
  return data.status;
}

export async function unsubscribeNewsletter(
  client: ProfileClient,
  email: string,
): Promise<void> {
  await client.invoke("unsubscribeToNewsletter post /newsletter/unsubscribe", {
    body: { email },
  });
}

export function isNewsletterSubscriber(status: NewsletterStatus): boolean {
  return !NOT_SUBSCRIBED.includes(status);
}

export function isNewsletterConfirmationNeeded(
  status: NewsletterStatus,
): boolean {
  return status === "notSet";
}
