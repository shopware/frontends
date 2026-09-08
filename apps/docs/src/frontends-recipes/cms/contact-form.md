---
nav:
  position: 20
recipe:
  area: cms
  status: stable
  frameworks:
    - vue
  composables:
    - useSalutations
    - useNavigationContext
    - useCmsTranslations
  helpers: []
  operations:
    - sendContactMail post /contact-form
    - readSalutation post /salutation
  schemas:
    - Salutation
    - CmsSlot
    - SeoUrl
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "CMS",
    action: "Read the element config",
    detail:
      "A contact form is a CMS element. Its title and confirmation text come from the element configuration, with the component's own strings as fallbacks.",
    code: "getConfigValue('confirmationText')",
    state: "element config",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Load the salutations",
    detail:
      "The form takes a salutationId, not a label, so a salutation select needs the list. useSalutations fetches it on mount when the shared list is empty.",
    code: "const { getSalutations } = useSalutations()",
    state: "swSalutations",
    typeKeys: ['operations["readSalutation post /salutation"]["response"]'],
  },
  {
    title: "UI",
    action: "Validate before sending",
    detail:
      "Only email, subject and comment are required by the schema. Everything else may or may not be required depending on the shop's settings, so client-side rules are a guess.",
    code: "const valid = await $v.value.$validate()",
    state: "local form state",
    typeKeys: [
      'operations["sendContactMail post /contact-form"]["body"]',
    ],
  },
  {
    title: "Context",
    action: "Attach the navigation id",
    detail:
      "navigationId identifies the category whose contact form configuration applies. It comes from the navigation context's foreignKey, not from the form itself.",
    code: "body: { ...state, navigationId: foreignKey }",
    state: "navigation context",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Send the mail",
    detail:
      "There is no composable. apiClient.invoke sends the body, and the operation answers 200 with no payload — no id, no confirmation, nothing to read.",
    code: 'apiClient.invoke("sendContactMail post /contact-form", { body })',
    state: "sw-context-token",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Show the confirmation",
    detail:
      "Because nothing comes back, the success state is entirely local. Replace the form with the configured confirmation text rather than leaving it fillable.",
    code: "formSent.value = true",
    state: "formSent",
    typeKeys: [],
  },
];
</script>

# Contact Form

## Goal

Build a contact form that submits to the Store API. The important part is what the schema warns about in its own description: only three fields are required there, and the shop's settings can require more — so the validation you write on the client is never the whole truth.

## Shopware Flow

`sendContactMail post /contact-form` has no composable wrapper. You call it through `apiClient.invoke`, and its response is `200` with no body at all — no reference number, no echo of the submission.

The operation's description says outright that "there can be more required fields, depending on the system settings". Its own `required` list is just `email`, `subject` and `comment`; `firstName`, `lastName` and `phone` are each documented as "may be required depending on the system settings". A rejection for a field your form treated as optional is therefore a normal outcome, not a bug in your validation.

<RecipeFlowDiagram label="Contact form flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The element configuration supplies the form title and the confirmation text.
2. `useSalutations` provides the list a salutation select needs, since the body takes a `salutationId`.
3. The form validates locally against the three fields the schema requires, plus whatever your shop configures.
4. `navigationId` is taken from `useNavigationContext().foreignKey` so the right category configuration applies.
5. `apiClient.invoke("sendContactMail post /contact-form")` sends the body and returns nothing.
6. The success state is local — replace the form with the configured confirmation text.

You do not get any identifier back. There is nothing to poll, nothing to look up, and no way to tell a duplicate submission from a first one.

## Request Flow

| Step                    | Code                                                     | Store API            | Type                                                                                       |
| ----------------------- | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| Load the salutations    | `getSalutations`                                         | `POST /salutation`   | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' /> |
| Read the element config | `getConfigValue("confirmationText")`                     | none                 | <SchemaTypeTooltip type-key='Schemas["CmsSlot"]' />                                        |
| Read the navigation id  | `foreignKey`                                             | none                 | <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />                                         |
| Submit the form         | `invoke("sendContactMail post /contact-form", { body })` | `POST /contact-form` | <SchemaTypeTooltip type-key='operations["sendContactMail post /contact-form"]["body"]' />  |
| Read the result         | none                                                     | `POST /contact-form` | none — the operation answers `200` with no body                                            |

The body also declares `slotId`, `cmsPageType` and `entityName` for resolving the slot configuration server-side. The component shipped in the CMS base layer sends only `navigationId`, so reach for the others when a form lives outside a category page.

## Composables

- `useSalutations`: `getSalutations` is the shared list — a `ComputedRef` of the array, not a loader — and `fetchSalutations()` is the request. The composable fetches on mount when the list is empty.
- `useNavigationContext`: `foreignKey` is the id of the entity the current URL resolved to, which is what `navigationId` should carry on a category page.
- `useCmsElementConfig`: `getConfigValue(name)` reads one value from the CMS element's configuration — the form title and the confirmation text. It lives under `packages/composables/src/cms/` rather than in a directory of its own, and is exported from `@shopware/composables` like the rest.
- `useCmsTranslations`: the injected translation object, used to override the component's built-in English strings.

There is deliberately no `useContactForm`. The request is one `apiClient.invoke` call and the state is one boolean.

## Types

Use generated Store API types when you need to type the submission or the salutation list:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["sendContactMail post /contact-form"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["Salutation"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ContactFormBody = operations["sendContactMail post /contact-form"]["body"];
type Salutation = Schemas["Salutation"];
```

`ContactFormBody` is the field list to build the form from — and the reminder that a privacy consent checkbox is not on it. Consent is a UI concern; the operation has no field for it.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import type { operations } from "#shopware";

const { apiClient } = useShopwareContext();
const { getSalutations } = useSalutations();
const { foreignKey } = useNavigationContext();

const form = reactive<operations["sendContactMail post /contact-form"]["body"]>(
  {
    salutationId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    comment: "",
  }
);

// consent is a UI requirement — the operation has no field for it
const consentGiven = ref(false);

const isSubmitting = ref(false);
const formSent = ref(false);
const fieldErrors = ref<ApiError[]>([]);
const formError = ref("");

const submit = async () => {
  fieldErrors.value = [];
  formError.value = "";
  isSubmitting.value = true;

  try {
    await apiClient.invoke("sendContactMail post /contact-form", {
      body: {
        ...form,
        // identifies which category's form configuration applies
        navigationId: foreignKey.value || undefined,
      },
    });

    // nothing comes back, so the success state is local
    formSent.value = true;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // the shop may require fields this form treated as optional
      fieldErrors.value = error.details.errors;
    } else {
      formError.value = "Your message could not be sent. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <p v-if="formSent">Thank you. We will get back to you shortly.</p>

  <form v-else @submit.prevent="submit">
    <p v-if="formError">{{ formError }}</p>

    <ul v-if="fieldErrors.length">
      <li v-for="(error, index) in fieldErrors" :key="index">
        {{ error.detail }}
      </li>
    </ul>

    <label>
      Salutation
      <select v-model="form.salutationId">
        <option value="">Not specified</option>
        <option
          v-for="salutation in getSalutations"
          :key="salutation.id"
          :value="salutation.id"
        >
          {{ salutation.translated?.displayName ?? salutation.displayName }}
        </option>
      </select>
    </label>

    <label>
      First name
      <input v-model="form.firstName" type="text" autocomplete="given-name" />
    </label>

    <label>
      Last name
      <input v-model="form.lastName" type="text" autocomplete="family-name" />
    </label>

    <label>
      Email
      <input v-model="form.email" type="email" autocomplete="email" required />
    </label>

    <label>
      Phone
      <input v-model="form.phone" type="tel" autocomplete="tel" />
    </label>

    <label>
      Subject
      <input v-model="form.subject" type="text" required />
    </label>

    <label>
      Your message
      <textarea v-model="form.comment" required />
    </label>

    <label>
      <input v-model="consentGiven" type="checkbox" />
      I agree to the privacy policy
    </label>

    <button type="submit" :disabled="isSubmitting || !consentGiven">
      {{ isSubmitting ? "Sending…" : "Send my message" }}
    </button>
  </form>
</template>
```

The consent checkbox gates the submit button and is not part of the body. Spreading the whole form state into the request would send it as a field the operation does not declare.

## State And Session

There is no shared state here. The form data is component-local, the success flag is component-local, and the errors are component-local. The only shared value the recipe touches is `swSalutations`, filled by `useSalutations` and reused by every other form in the application.

The submission still runs in the session identified by the `sw-context-token`, which is how the shop resolves the sales channel and therefore the language of the mail. It does not require a logged-in customer, and it does not read the customer's details — a logged-in visitor still types their email address into the form.

`navigationId` is the one piece of context that changes what the backend does. It points at a category whose contact form configuration — the recipient, for instance — overrides the default, which is why the shipped component takes it from `useNavigationContext().foreignKey` rather than from a prop.

## Edge Cases

- The schema requires only `email`, `subject` and `comment`. `firstName`, `lastName` and `phone` are documented as possibly required by the shop's settings, so a `400` on a field you left optional is expected behaviour.
- The operation answers `200` with no body. There is no submission id, so a duplicate submit cannot be detected or deduplicated after the fact.
- Nothing is returned, so the confirmation is local state. Leaving the form fillable after a success invites a second identical mail.
- `salutationId` is a UUID, not a label. Loading the salutation list is a prerequisite for that field, and `useSalutations().getSalutations` is the list rather than a loader.
- A privacy consent checkbox has no field on the body. Spreading a form state that contains one sends an undeclared property — the CMS base layer's own component does exactly that.
- `navigationId` overrides the form configuration for a category. Sending an empty string rather than omitting it is not the same as sending nothing.
- `slotId`, `cmsPageType` and `entityName` exist for resolving the slot configuration when the form is not on a category page. The shipped component sends none of them.
- Rejections arrive as an `ApiClientError` with `details.errors`. Each entry has a `detail` and a `source.pointer` identifying the field, which is what maps a server-side requirement onto your form.
- The mail's language follows the sales channel resolved from the context, not from anything in the body.
- Rate limiting applies to this endpoint in a default Shopware setup. Treat a `429` as a distinct case rather than a generic failure.

## Common Mistakes

- Do not treat your client-side rules as the contract. The shop can require more fields.
- Do not spread a form state containing a consent checkbox into the request body.
- Do not leave the form on screen after a successful submit.
- Do not expect an identifier back to confirm the submission.
- Do not render a salutation select before the salutation list has loaded.
- Do not call `getSalutations()` as a function. It is the list.
- Do not omit `navigationId` on a category page — the configured recipient depends on it.
- Do not render the raw `detail` of every API error as one blob. Map them onto fields with `source.pointer`.
- Do not retry automatically on failure. Without an id you cannot tell whether the first attempt went through.

## Testing Checklist

- The salutation select is populated from `readSalutation post /salutation`.
- Submitting calls `sendContactMail post /contact-form` exactly once.
- The request body carries `navigationId` from the navigation context on a category page.
- The request body does not carry the consent checkbox.
- A successful submit replaces the form with the confirmation text.
- The submit button is disabled while consent has not been given.
- A `400` naming a field the form treated as optional is shown on that field.
- A network failure shows a form-level error and keeps the entered text.
- The form is not re-submittable after a success without a reload.

## Related Links

- [Content pages](../../getting-started/cms/content-pages.html)
- [Create elements](../../getting-started/cms/create-elements.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [API client package](../../packages/api-client.html)
