import type { Schemas, operations } from "#shopware";

type NewsletterSubscribeBody =
  operations["subscribeToNewsletter post /newsletter/subscribe"]["body"];
type NewsletterSubscribeResponse =
  operations["subscribeToNewsletter post /newsletter/subscribe"]["response"];
type NewsletterConfirmBody =
  operations["confirmNewsletter post /newsletter/confirm"]["body"];
type AccountNewsletterRecipient = Schemas["AccountNewsletterRecipient"];
type NewsletterRecipientStatus = AccountNewsletterRecipient["status"];
