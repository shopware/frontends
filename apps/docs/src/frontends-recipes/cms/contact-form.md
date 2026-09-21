---
nav:
  position: 10
recipe:
  area: cms
  status: stable
  frameworks:
    - vue
  composables:
    - useCmsElementConfig
    - useSalutations
    - useNavigationContext
    - useCmsTranslations
  helpers:
    - getTranslatedProperty
  operations:
    - sendContactMail post /contact-form
    - readSalutation post /salutation
    - readSalutationGet get /salutation
  schemas:
    - Salutation
    - CmsSlot
    - SeoUrl
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "CMS",
    action: "Read the element config",
    detail:
      "A contact form is a CMS element, and the element's own config decides which form renders at all: getConfigValue('type') sends 'newsletter' to the newsletter form and everything else to the contact form.",
    code: "getConfigValue('type')",
    state: "element config",
    typeKeys: ['Schemas["CmsSlot"]'],
  },
  {
    title: "UI",
    action: "Load the salutations",
    detail:
      "The form takes a salutationId, not a label, so a salutation select needs the list. useSalutations fetches it on mount when it has not been fetched yet — so never on the server — and switches to the GET route when cacheableReads is enabled, which the starter ships on.",
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
    typeKeys: ['operations["sendContactMail post /contact-form"]["body"]'],
  },
  {
    title: "Context",
    action: "Attach the navigation id",
    detail:
      "navigationId identifies the category whose contact form configuration applies. It comes from the navigation context's foreignKey, which is an empty string — not undefined — whenever nothing upstream seeded that context, including on any route outside the catch-all page.",
    code: "navigationId: foreignKey.value || undefined",
    state: "navigation context",
    typeKeys: ['Schemas["SeoUrl"]'],
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

One step happens before any of this. The CMS element is a generic form element, not a contact form element: `CmsElementForm` reads `getConfigValue("type")` and renders `SwNewsletterForm` for `"newsletter"`, falling through to `SwContactForm` for everything else. Keep that switch when you override the element.

Where you put that override matters as much as what is in it. CMS elements are resolved at runtime through `resolveComponent`, so an override only takes effect from a directory registered `global: true` — in `vue-starter-template` that is `app/components/cms/`. Dropped anywhere else, including plain `app/components/`, the base layer's component keeps rendering with no error and no warning. See [Overwriting CMS components](../../guides/cms/overwriting-cms.html).

<RecipeFlowDiagram label="Contact form flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The element configuration decides which form renders, and supplies the form title and the confirmation text.
2. `useSalutations` provides the list a salutation select needs, since the body takes a `salutationId`.
3. The form validates locally against the three fields the schema requires, plus whatever your shop configures.
4. `navigationId` is taken from `useNavigationContext().foreignKey` so the right category configuration applies.
5. `apiClient.invoke("sendContactMail post /contact-form")` sends the body and returns nothing.
6. The success state is local — replace the form with the configured confirmation text.

You do not get any identifier back. There is nothing to poll, nothing to look up, and no way to tell a duplicate submission from a first one.

## Request Flow

| Step                    | Code                                                     | Store API            | Type                                                                                       |
| ----------------------- | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| Read the element config | `getConfigValue("type")`                                 | none                 | <SchemaTypeTooltip type-key='Schemas["CmsSlot"]' />                                        |
| Load the salutations    | `getSalutations`                                         | `POST /salutation`   | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' /> |
| Read the navigation id  | `foreignKey`                                             | none                 | <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />                                         |
| Submit the form         | `invoke("sendContactMail post /contact-form", { body })` | `POST /contact-form` | <SchemaTypeTooltip type-key='operations["sendContactMail post /contact-form"]["body"]' />  |
| Read the result         | none                                                     | `POST /contact-form` | none — the operation answers `200` with no body                                            |

The salutation row has a second variant, and it is the one you will actually hit. With `cacheableReads` enabled, `useSalutations` calls <SchemaTypeTooltip type-key='operations["readSalutationGet get /salutation"]["response"]' /> over `GET /salutation` instead, so the list is HTTP-cacheable. The library default is off, but `vue-starter-template` ships `cacheableReads: true`, so in the supported starting point the salutation list arrives over `GET`. The payload is the same either way, and nothing in your form code changes.

The body also declares `slotId`, `cmsPageType` and `entityName` for resolving the slot configuration server-side. The component shipped in the CMS base layer sends only `navigationId`, so reach for the others when a form lives outside a category page.

## Composables

There is deliberately no `useContactForm`. The request is one `apiClient.invoke` call and the state is one boolean, so what you assemble instead is four small composables. Read the scope column carefully: three of the four are `provide`/`inject`, so their scope is a component subtree, not the application — and where you mount the form decides what they see.

| Composable             | Scope                                       | Reach for it when                                             |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| `useSalutations`       | the calling component's subtree             | you render a salutation select                                |
| `useNavigationContext` | the subtree of the page that seeded it      | you need the id of the entity the route resolved to           |
| `useCmsTranslations`   | the subtree that provided `cmsTranslations` | reading the strings the application provided                  |
| `useCmsElementConfig`  | one CMS element                             | reading that element's own configuration — type, title, texts |

`useSalutations` is the only one with more than one member:

- **Read** — `getSalutations` is a `ComputedRef` of the array, not a loader. Call it as a value.
- **Fetch** — `fetchSalutations()` performs the request and returns the response.

Eight things the generated reference will not tell you:

- `useCmsElementConfig` has no generated reference page at all. The docs site builds one page per `use*` **directory** under `packages/composables/src` — the filter lives in `apps/docs/src/packages/composables/[composable].paths.ts` — and this composable lives in `src/cms/` next to `useCmsElementImage`. It is exported from `@shopware/composables` like the rest, it just has nowhere to be listed.
- `getConfigValue("type")` is what decides which form renders. `CmsElementForm` sends `"newsletter"` to `SwNewsletterForm` and everything else to `SwContactForm`. An override that drops the switch silently breaks every newsletter form in the shop.
- `getConfigValue("title")` falls back to a hardcoded `"Contact"` in the shipped component, which `useCmsTranslations` cannot override, because the title uses `||`. `confirmationText` uses `??`, so it reaches the injected translation only when the element has no value for that key at all: a blank value in the administration renders an empty confirmation, and a config whose `source` is `"mapped"` renders the literal `false`.
- `useCmsTranslations` is the reading side and cannot override anything — its whole body is `inject("cmsTranslations", {})`. The override is the opposite call, `provide("cmsTranslations", messages)`, which `vue-starter-template` makes in `app/app.vue`. `SwContactForm` merges the result with `defu` once during setup, so translations swapped after mount never reach an already-rendered form.
- `useSalutations` fetches on mount when the list has **not been fetched yet** — the guard is `if (!_salutations.value)`, not a length check. `fetchSalutations` assigns `[]` on an empty response and `[]` is truthy, so a shop that genuinely returns zero salutations is never retried. `getSalutations` renders the unfetched and the fetched-empty state identically, which is what makes the two indistinguishable in a template.
- `useSalutations` picks its route from `cacheableReads`: `readSalutationGet get /salutation` when the flag is on, `readSalutation post /salutation` when it is off.
- `foreignKey` is a `ComputedRef<string>` that defaults to `""`, never `undefined`. That matters because `navigationId` declares a UUID pattern, so the empty string is not a valid value to post.
- `useNavigationContext()` called with no argument only injects. Something upstream has to seed it, and in `vue-starter-template` the only thing that does is the catch-all route `app/pages/[...all].vue`. Outside that page's subtree — an explicit file route such as `app/pages/contact.vue`, or a layout — `foreignKey` is `""` on a perfectly resolved URL. There you pass the `SeoUrl` in yourself with `useNavigationContext(seoResult)`, or take `navigationId` as a prop, which is what `[...all].vue` already does for the pages below it.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

`salutationId` and `navigationId` are both declared `?: string` — optional, and a plain `string` when present, while the schema narrows them with `pattern: ^[0-9a-f]{32}$`. Being optional is what lets you omit them, which is exactly what the example's `|| undefined` does. The type will not stop you from posting `""`; the backend's validation will.

`ApiError` is optional throughout — `detail?`, `title?`, `code?`, `source?: { pointer? }` — so type an error list as `ApiError[]` and reach into it with `error.source?.pointer`, never `error.source.pointer`.

## Minimal Vue Example

<CodeExample title="Minimal contact form">

```vue
<script setup lang="ts">
import { ApiClientError, isTimeoutError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { getTranslatedProperty } from "@shopware/helpers";

import type { operations } from "#shopware";

const { apiClient } = useShopwareContext();
const { getSalutations } = useSalutations();
const { foreignKey } = useNavigationContext();

const heading = ref<HTMLElement>();

const form = reactive<operations["sendContactMail post /contact-form"]["body"]>(
  {
    salutationId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    comment: "",
  },
);

const consentGiven = ref(false);

const isSubmitting = ref(false);
const formSent = ref(false);
const apiErrors = ref<ApiError[]>([]);
const formError = ref("");

const canSubmit = computed(() => !isSubmitting.value && consentGiven.value);

const submitHint = computed(() =>
  consentGiven.value ? "" : "Agree to the privacy policy to send your message.",
);

const errorsByField = computed(() => {
  const byField: Record<string, string> = {};

  for (const error of apiErrors.value) {
    const field = error.source?.pointer?.split("/").pop();

    if (field) {
      byField[field] =
        error.detail ?? error.title ?? "This value is not valid.";
    }
  }

  return byField;
});

const submit = async () => {
  if (!canSubmit.value) return;

  apiErrors.value = [];
  formError.value = "";
  isSubmitting.value = true;

  try {
    await apiClient.invoke("sendContactMail post /contact-form", {
      body: {
        ...form,
        salutationId: form.salutationId || undefined,
        navigationId: foreignKey.value || undefined,
      },
    });

    formSent.value = true;
    await nextTick();
    heading.value?.focus();
  } catch (error) {
    if (isTimeoutError(error)) {
      formError.value =
        "We could not confirm your message was sent. Please check with us before sending it again.";
    } else if (error instanceof ApiClientError) {
      apiErrors.value = error.details?.errors ?? [];

      if (!Object.keys(errorsByField.value).length) {
        formError.value = "Your message could not be sent. Please try again.";
      }
    } else {
      formError.value = "Your message could not be sent. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section>
    <h2 ref="heading" tabindex="-1">{{ formSent ? "Thank you" : "Contact" }}</h2>

    <p v-if="formSent" role="status">
      We have received your message and will get back to you shortly.
    </p>

    <form v-else @submit.prevent="submit">
      <p v-if="formError" role="alert">{{ formError }}</p>

      <label for="salutation">Salutation</label>
      <select
        id="salutation"
        v-model="form.salutationId"
        :disabled="!getSalutations.length"
      >
        <option value="">Not specified</option>
        <option
          v-for="salutation in getSalutations"
          :key="salutation.id"
          :value="salutation.id"
        >
          {{ getTranslatedProperty(salutation, "displayName") }}
        </option>
      </select>

      <label for="first-name">First name</label>
      <input
        id="first-name"
        v-model="form.firstName"
        type="text"
        autocomplete="given-name"
        :aria-invalid="errorsByField.firstName ? 'true' : undefined"
        :aria-describedby="
          errorsByField.firstName ? 'first-name-error' : undefined
        "
      />
      <p v-if="errorsByField.firstName" id="first-name-error" role="alert">
        {{ errorsByField.firstName }}
      </p>

      <label for="last-name">Last name</label>
      <input
        id="last-name"
        v-model="form.lastName"
        type="text"
        autocomplete="family-name"
        :aria-invalid="errorsByField.lastName ? 'true' : undefined"
        :aria-describedby="
          errorsByField.lastName ? 'last-name-error' : undefined
        "
      />
      <p v-if="errorsByField.lastName" id="last-name-error" role="alert">
        {{ errorsByField.lastName }}
      </p>

      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        required
        :aria-invalid="errorsByField.email ? 'true' : undefined"
        :aria-describedby="errorsByField.email ? 'email-error' : undefined"
      />
      <p v-if="errorsByField.email" id="email-error" role="alert">
        {{ errorsByField.email }}
      </p>

      <label for="phone">Phone</label>
      <input
        id="phone"
        v-model="form.phone"
        type="tel"
        autocomplete="tel"
        :aria-invalid="errorsByField.phone ? 'true' : undefined"
        :aria-describedby="errorsByField.phone ? 'phone-error' : undefined"
      />
      <p v-if="errorsByField.phone" id="phone-error" role="alert">
        {{ errorsByField.phone }}
      </p>

      <label for="subject">Subject</label>
      <input
        id="subject"
        v-model="form.subject"
        type="text"
        required
        :aria-invalid="errorsByField.subject ? 'true' : undefined"
        :aria-describedby="errorsByField.subject ? 'subject-error' : undefined"
      />
      <p v-if="errorsByField.subject" id="subject-error" role="alert">
        {{ errorsByField.subject }}
      </p>

      <label for="comment">Your message</label>
      <textarea
        id="comment"
        v-model="form.comment"
        required
        :aria-invalid="errorsByField.comment ? 'true' : undefined"
        :aria-describedby="errorsByField.comment ? 'comment-error' : undefined"
      />
      <p v-if="errorsByField.comment" id="comment-error" role="alert">
        {{ errorsByField.comment }}
      </p>

      <input id="consent" v-model="consentGiven" type="checkbox" required />
      <label for="consent">I agree to the privacy policy</label>

      <p v-if="submitHint" id="submit-hint">{{ submitHint }}</p>

      <button
        type="submit"
        :aria-disabled="!canSubmit"
        :aria-describedby="submitHint ? 'submit-hint' : undefined"
      >
        {{ isSubmitting ? "Sending…" : "Send my message" }}
      </button>
    </form>
  </section>
</template>
```

</CodeExample>

The consent checkbox gates the submit button and is not part of the body. It is a UI requirement with no field on the operation, so it lives in its own `ref` rather than in `form` — spreading a form state that contains it would send an undeclared property.

The two `|| undefined` guards are the other thing to copy. `SwContactForm` in the CMS base layer posts `navigationId: foreignKey.value` unguarded and keeps `salutationId` at `""`, so on a page the navigation context did not resolve it sends empty strings for two fields the schema restricts to UUIDs.

Nothing comes back from a successful call, so `formSent` is the whole success story and it is local. The `catch` splits three ways because the three failures need different copy. A timeout is not an `ApiClientError` at all — it has no HTTP status and `isTimeoutError` is the only way to recognise it — and it must not invite a resend, because the mail may already have gone out. An `ApiClientError` carries the shop's own validation, which is where a field your form treated as optional turns out to be required. Anything else is a network failure.

`error.details` is the raw response body, not a parsed envelope: a proxy that answers with an HTML error page makes it a string, so `details?.errors ?? []` is load-bearing rather than defensive. `ApiError` is optional throughout, which is why `errorsByField` falls back through `detail` to `title` to its own copy, and why an error with no `source.pointer` falls out of the map into the form-level message instead of vanishing. Never render `detail` unfiltered — when the response body is empty the client substitutes a developer-facing placeholder that tells the customer to check their network tab.

Four things in the markup are deliberate. The heading is focusable and receives focus after a successful submit, because the form holding focus unmounts and a screen reader would otherwise never learn the message went out. The confirmation is a `role="status"` and every error is a `role="alert"`, because by the time they render the button has been re-enabled and focus is nowhere near them. The submit button carries `aria-disabled` rather than `disabled` — a disabled control cannot hold focus or explain itself, so the button would simply disappear from the tab order with no statement of why — and `canSubmit` is one computed read by both the button and `submit`, never two conditions kept in sync by hand. Each field's message is wired to its control with `aria-describedby` and `aria-invalid`, which is what makes `source.pointer` worth reading in the first place.

The salutation select is disabled until the list arrives. `useSalutations` fetches in `onMounted`, so the list is never part of the server-rendered HTML and `getSalutations` is `[]` for the whole first-paint-to-fetch window. The composable exposes no pending flag, so if you want the list in the SSR payload or a real loading state, fetch it yourself — `vue-starter-template` does exactly that in `app/components/form/SalutationSelect.vue`, with `useAsyncData` plus `getCachedData` and an `isLoading` derived from `status`, rather than through `useSalutations`.

The heading text is hardcoded here to keep the example self-contained. In an element override it comes from `getConfigValue("title")`, and the confirmation from `getConfigValue("confirmationText")`.

## State And Session

The form's own state is entirely local: the form data, the success flag and the errors all live in the component. What the recipe reads from outside are three injected values — `swSalutations`, `navigation` and `cmsTranslations` — and none of them is application-wide.

`swSalutations` is the one worth understanding, because its name suggests a global. `useSalutations` does `inject("swSalutations", ref())` followed by `provide("swSalutations", _salutations)`, and nothing in the packages or the templates provides that key at the application root. `provide` only reaches descendants, and the `ref()` default is created fresh on every call, so two callers that are siblings rather than ancestor and descendant each get their own list. That is not hypothetical for this recipe: `SwNewsletterForm` calls `useSalutations` too, so a page carrying a contact form element and a newsletter form element issues two `POST /salutation` requests and holds two copies of the result.

Adding an application-root `provide("swSalutations", ref())` makes the two share one ref but does not reduce the request count, because both `onMounted` hooks run before either fetch assigns and the `if (!_salutations.value)` guard is therefore still `true` in both. If one request is what you want, fetch the list through `useAsyncData` under a shared key — the way `vue-starter-template` does in `app/components/form/SalutationSelect.vue` — rather than relying on the composable's injection.

The submission still runs in the session identified by the `sw-context-token`, which is how the shop resolves the sales channel and therefore the language of the mail. It does not require a logged-in customer, and it does not read the customer's details — a logged-in visitor still types their email address into the form.

`navigationId` is the one piece of context that changes what the backend does. It points at a category whose contact form configuration overrides the default, which is why the shipped component takes it from `useNavigationContext().foreignKey` rather than from a prop.

## Edge Cases

- The schema requires only `email`, `subject` and `comment`. `firstName`, `lastName` and `phone` are documented as possibly required by the shop's settings, so a `400` on a field you left optional is expected behaviour.
- The shipped `SwContactForm` validates _more_ strictly than the schema, not less: it requires `firstName`, `lastName` and `phone`, and a `comment` of at least 10 characters. Copying those rules rejects input the Store API would have accepted. The schema plus the shop's settings are the contract, not the reference implementation.
- The operation answers `200` with no body. There is no submission id, so a duplicate submit cannot be detected or deduplicated after the fact.
- Nothing is returned, so the confirmation is local state. Leaving the form fillable after a success invites a second identical mail.
- `salutationId` and `navigationId` both declare `pattern: ^[0-9a-f]{32}$`. An unselected `<select>` leaves `""`, and `foreignKey` is `""` when the route resolved to nothing — neither is a valid value, so omit the field instead of sending the empty string.
- `salutationId` is a UUID, not a label. Loading the salutation list is a prerequisite for that field, and `useSalutations().getSalutations` is the list rather than a loader.
- A privacy consent checkbox has no field on the body. Spreading a form state that contains one sends an undeclared property — the CMS base layer's own component does exactly that.
- `slotId`, `cmsPageType` and `entityName` exist for resolving the slot configuration when the form is not on a category page. The shipped component sends none of them.
- The CMS element is a form element, not a contact form element. `CmsElementForm` branches on `getConfigValue("type")`, so an override that assumes "contact form" breaks the newsletter variant.
- HTTP failures arrive as an `ApiClientError`. Each entry in `details.errors` _may_ carry a `detail` and a `source.pointer` identifying the field — both are optional on `ApiError`, so read them as `error.source?.pointer` and fall back to `error.title`.
- `error.details` is the raw response body, not a guaranteed envelope. It is `response._data`, so a proxy answering with an HTML error page makes it a string and `details.errors` `undefined`; read it as `error.details?.errors ?? []`. When the body is empty the client substitutes its own placeholder entry whose `detail` reads "API did not return errors, but request failed. Please check the network tab." — never render that to a customer.
- Timeouts and network failures are **not** `ApiClientError`. They carry no HTTP status, so check `isTimeoutError(error)` before branching on `error.status`. A timeout is the dangerous one: the request may already have reached the API and been processed, so its copy must not invite a resend.
- Nothing in the composables carries a request deadline. Configure `apiClientConfig.timeout`, or a request that never settles leaves the form on "Sending…" with no error and no way out.
- The schema declares only a `200` for this operation. Every other status — including whatever a shop's rate limiting returns — reaches you as an `ApiClientError`, so classify it by `error.status` rather than treating all failures alike.
- The salutation list is fetched in `onMounted`, so it is never in the server-rendered HTML and `getSalutations` is `[]` until the fetch resolves. `useSalutations` exposes no pending flag, so gate the select on the list's length or fetch it yourself.
- The mail's language follows the sales channel resolved from the context, not from anything in the body.

## Common Mistakes

- Do not treat your client-side rules as the contract. The shop can require more fields, and the shipped component's rules require more than the schema does.
- Do not spread a form state containing a consent checkbox into the request body.
- Do not post `""` for `salutationId` or `navigationId`. Both declare a UUID pattern — omit the field instead.
- Do not drop the `getConfigValue("type")` switch when overriding `CmsElementForm`, and do not put the override outside a directory registered `global: true` — it will never render.
- Do not leave the form on screen after a successful submit.
- Do not expect an identifier back to confirm the submission.
- Do not render a salutation select before the salutation list has loaded.
- Do not call `getSalutations()` as a function. It is the list.
- Do not omit `navigationId` on a category page — the category's own form configuration depends on it.
- Do not render the raw `detail` of every API error as one blob. Map them onto fields with `source.pointer`, and keep your own copy for the ones that carry no pointer.
- Do not read `error.details.errors` unguarded. A non-JSON error body makes `details` a string, and the unguarded read crashes the form's render.
- Do not tell the customer a timed-out submission failed. Check `isTimeoutError` first — the mail may already be on its way.
- Do not retry automatically on failure. Without an id you cannot tell whether the first attempt went through.
- Do not assume `useSalutations` shares one list across the page. Sibling components each get their own.

## Testing Checklist

- The salutation select is populated from `readSalutationGet get /salutation` when `cacheableReads` is on, and from `readSalutation post /salutation` when it is off. Assert whichever your `nuxt.config` selects — `vue-starter-template` ships the flag on.
- The salutation select is inert until the list arrives, and the server-rendered HTML does not claim the list is empty.
- Submitting calls `sendContactMail post /contact-form` exactly once.
- The request body carries `navigationId` from the navigation context on a category page, and the component is mounted somewhere that navigation context actually reaches.
- An unselected salutation omits `salutationId` instead of sending an empty string.
- The request body does not carry the consent checkbox.
- `CmsElementForm` still renders the newsletter form when the element's `type` is `newsletter`.
- A successful submit replaces the form with the confirmation text and moves focus to the heading.
- Submitting without consent is refused by the handler, not only by the button's appearance.
- A `400` naming a field the form treated as optional is shown on that field, wired to it with `aria-describedby`.
- A rejection whose entries carry no `source.pointer` still produces a visible form-level message.
- An error response with a non-JSON body shows a form-level message instead of crashing the render.
- A timed-out submission does not tell the customer to send the message again.
- A network failure shows a form-level error and keeps the entered text.
- The form is not re-submittable after a success without a reload.

## Related Links

- [Create content pages](../../guides/cms/content-pages.html)
- [Create elements](../../guides/cms/create-elements.html)
- [Overwriting CMS components](../../guides/cms/overwriting-cms.html)
- [Custom CMS elements](../../guides/cms/custom-elements.html)
- [Composables reference](../../packages/composables/)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [API client package](../../packages/api-client.html)
