import type {
  CmsActions,
  CmsContactFormInput,
  CmsContactFormResult,
  CmsNewsletterInput,
  CmsNewsletterResult,
} from "@shopware/cms-base-layer-react/client";

import { resolveNewsletterStorefrontUrl } from "@/features/account/profile/newsletterStorefrontUrl";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "@/features/account/profile/profileApi";
import type { StorefrontUrlContext } from "@/features/session/storefrontUrl";
import type { StorefrontSession } from "@/features/session/types";
import type { Translate } from "@/i18n/translate";

import { sendContactForm } from "./formsApi";
import type { ContactFormBody, FormsClient } from "./formsApi";
import {
  isUnknownNewsletterRecipient,
  logFormFailure,
  resolveFormFailure,
} from "./formViolations";
import type { FormScope } from "./formViolations";

export type FormActionsDeps = {
  getClient: () => Promise<FormsClient>;
  getSession: () => Promise<Pick<StorefrontSession, "context">>;
  t: Translate;
  resolveStorefrontUrl?: (
    context: StorefrontUrlContext | null,
  ) => Promise<string>;
};

export type FormActions = Pick<
  CmsActions,
  "submitContactForm" | "subscribeNewsletter"
>;

function withoutUndefined<VALUES extends Record<string, unknown>>(
  values: VALUES,
): Partial<VALUES> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as Partial<VALUES>;
}

function contactFormBody({
  salutationId,
  firstName,
  lastName,
  email,
  phone,
  subject,
  comment,
  navigationId,
  entityName,
  slotId,
}: CmsContactFormInput): ContactFormBody {
  return {
    email,
    subject,
    comment,
    ...withoutUndefined({
      salutationId,
      firstName,
      lastName,
      phone,
      navigationId,
      entityName,
      slotId,
    }),
  };
}

export function createFormActions({
  getClient,
  getSession,
  t,
  resolveStorefrontUrl = resolveNewsletterStorefrontUrl,
}: FormActionsDeps): FormActions {
  const failed = (scope: FormScope, error: unknown) => {
    logFormFailure(scope, error);
    return { ok: false, ...resolveFormFailure(error, t) };
  };

  return {
    async submitContactForm(
      input: CmsContactFormInput,
    ): Promise<CmsContactFormResult> {
      try {
        const successMessage = await sendContactForm(
          await getClient(),
          contactFormBody(input),
        );
        return successMessage ? { ok: true, successMessage } : { ok: true };
      } catch (error) {
        return failed("contact", error);
      }
    },

    async subscribeNewsletter({
      email,
      option = "subscribe",
      salutationId,
      firstName,
      lastName,
    }: CmsNewsletterInput): Promise<CmsNewsletterResult> {
      try {
        const client = await getClient();
        if (option === "unsubscribe") {
          await unsubscribeNewsletter(client, email);
          return { ok: true, status: "optOut" };
        }
        const { context } = await getSession();
        const storefrontUrl = await resolveStorefrontUrl(context);
        const status = await subscribeNewsletter(client, {
          email,
          storefrontUrl,
          salutationId,
          firstName,
          lastName,
        });
        return { ok: true, status };
      } catch (error) {
        if (option === "unsubscribe" && isUnknownNewsletterRecipient(error)) {
          return { ok: true, status: "optOut" };
        }
        return failed("newsletter", error);
      }
    },
  };
}
