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
      "A contact form is a CMS element, and the element's own config decides which form renders at all. This step happens in the base layer's CmsElementForm, above the example: getConfigValue('type') sends 'newsletter' to the newsletter form and everything else to the contact form.",
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
      "A default installation needs seven fields, not the three the schema marks required: salutationId always, plus firstName, lastName and phone from settings that ship enabled. The example marks them required in the markup and gates the submit handler on canSubmit; the server stays the authority either way.",
    code: "if (!canSubmit.value) return;",
    state: "local form state",
    typeKeys: ['operations["sendContactMail post /contact-form"]["body"]'],
  },
  {
    title: "Context",
    action: "Attach the slot and navigation ids",
    detail:
      "slotId is what makes the element's own mailReceiver and confirmation text apply; without it the backend falls back to the shop's default address and an empty message. navigationId only overrides that resolved configuration with a category's, so it is the secondary of the two.",
    code: "slotId: content.id, navigationId: foreignKey.value || undefined",
    state: "element config + navigation context",
    typeKeys: ['Schemas["CmsSlot"]', 'Schemas["SeoUrl"]'],
  },
  {
    title: "Store API",
    action: "Send the mail",
    detail:
      "There is no composable. apiClient.invoke sends the body and a default installation answers 200 with individualSuccessMessage — the resolved confirmation text. There is still no id, and the generated type says never, so reading it needs a cast.",
    code: 'apiClient.invoke("sendContactMail post /contact-form", { body })',
    state: "sw-context-token",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Show the confirmation",
    detail:
      "The success flag is local, but the message is not: individualSuccessMessage is the only value that reflects a category override, so prefer it over the slot config you read client-side.",
    code: "formSent.value = true",
    state: "formSent",
    typeKeys: [],
  },
];
</script>

# Contact Form

## Goal

Build a contact form that submits to the Store API. The important part is the gap between the schema and a real shop: the schema marks three fields required, a default Shopware installation rejects the form unless seven are filled — so the schema is a floor, not the contract.

## Shopware Flow

`sendContactMail post /contact-form` has no composable wrapper. You call it through `apiClient.invoke`, and the schema declares its `200` with no response content at all — which is why `@shopware/api-gen` emits `response: never` for it. A default installation does return a body, `{ "individualSuccessMessage": "..." }`, so the generated type is wrong rather than the endpoint being silent. What is genuinely absent is any identifier: no reference number, no echo of the submission.

The operation's description says outright that "there can be more required fields, depending on the system settings", and on a default installation it already does. Its `required` list is just `email`, `subject` and `comment`, but `firstName`, `lastName` and `phone` — each documented as "may be required depending on the system settings" — are settings that ship **enabled**. Post only the three the schema names and a stock shop answers `400` for four fields, not zero.

`salutationId` is the fourth of those, and the sharpest: the schema gives no warning about it at all. It is absent from `required`, carries no note, and is not a setting you can turn off — the platform's contact form validation requires it unconditionally. Neither an empty string nor an omitted field gets through, which is why the example preselects a salutation instead of starting the select empty.

So the practical default is seven fields: `email`, `subject` and `comment` from the schema, `salutationId` always, and `firstName`, `lastName` and `phone` from settings a shop can switch off. Build the form for seven and let the `400` tell you if a particular shop wants fewer.

One step happens before any of this. The CMS element is a generic form element, not a contact form element: `CmsElementForm` reads `getConfigValue("type")` and renders `SwNewsletterForm` for `"newsletter"`, falling through to `SwContactForm` for everything else. Keep that switch when you override the element — the other branch is its own flow, covered by the [Newsletter recipe](../account/newsletter.html).

Where you put that override matters as much as what is in it. CMS elements are resolved at runtime through `resolveComponent`, so an override only takes effect from a directory registered `global: true` — in `vue-starter-template` that is `app/components/cms/`. Dropped anywhere else, including plain `app/components/`, the base layer's component keeps rendering with no error and no warning. See [Overwriting CMS components](../../guides/cms/overwriting-cms.html).

<RecipeFlowDiagram label="Contact form flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The element configuration decides which form renders, and supplies the form title and the confirmation text.
2. `useSalutations` provides the list a salutation select needs, since the body takes a `salutationId`.
3. The form validates locally against the seven fields a default shop requires, knowing a given shop may want fewer.
4. `slotId` carries the element's id so its own configuration applies, and `navigationId` from `useNavigationContext().foreignKey` overrides it with a category's.
5. `apiClient.invoke("sendContactMail post /contact-form")` sends the body and answers `200` with `individualSuccessMessage`, which the generated type does not describe.
6. The success flag is local, but the confirmation copy comes from `individualSuccessMessage` in the response, with the slot config as fallback.

You do not get any identifier back. There is nothing to poll, nothing to look up, and no way to tell a duplicate submission from a first one.

## Request Flow

| Step                    | Code                                                     | Store API            | Type                                                                                       |
| ----------------------- | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| Read the element config | `getConfigValue("type")`                                 | none                 | <SchemaTypeTooltip type-key='Schemas["CmsSlot"]' />                                        |
| Load the salutations    | `getSalutations`                                         | `POST /salutation`   | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' /> |
| Read the navigation id  | `foreignKey`                                             | none                 | <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />                                         |
| Submit the form         | `invoke("sendContactMail post /contact-form", { body })` | `POST /contact-form` | <SchemaTypeTooltip type-key='operations["sendContactMail post /contact-form"]["body"]' />  |
| Read the result         | `data.individualSuccessMessage`                          | `POST /contact-form` | `never` in the generated types — see below                                                 |

The salutation row has a second variant, and it is the one you will actually hit. With `cacheableReads` enabled, `useSalutations` calls <SchemaTypeTooltip type-key='operations["readSalutationGet get /salutation"]["response"]' /> over `GET /salutation` instead, so the list is HTTP-cacheable. The library default is off, but `vue-starter-template` ships `cacheableReads: true`, so in the supported starting point the salutation list arrives over `GET`. The payload is the same either way, and nothing in your form code changes.

The body also declares `slotId`, `cmsPageType` and `entityName`, and `slotId` is the one that matters most: it is how the backend finds the element's own `mailReceiver` and confirmation text. `navigationId` is described in the schema as an override of that configuration, not a replacement for it — send only `navigationId` and the mail goes to the shop's default address with an empty message. The component shipped in the CMS base layer sends only `navigationId`, so an element-level receiver configured in the administration never reaches the API.

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
- `foreignKey` is a `ComputedRef<string>` that defaults to `""`, never `undefined`. That does not fail loudly — an empty `navigationId` is ignored and the call still answers `200`, despite the UUID pattern the schema declares for it. What you lose is silent: no category override is applied, so the element's own configuration stands when you thought a category's had won.
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

The response type is the one place the generated types are wrong. Because the schema declares the `200` with no content, `api-gen` emits `response: never`, so `invoke` resolves to `{ data: never; status: 200 }` and `data.individualSuccessMessage` will not compile. Cast at that one point until the schema catches up, and keep the cast on `data` rather than on the whole call so the request stays type-checked:

```ts
type ContactFormResult = { individualSuccessMessage?: string };
```

Never hand-edit `packages/api-client/api-types/*.d.ts` to add it — those files are generated.

`salutationId` and `navigationId` are both declared `?: string` — optional, and a plain `string` when present, while the schema narrows them with `pattern: ^[0-9a-f]{32}$`. Being optional is what lets you omit `navigationId`, which is what the example's `|| undefined` does.

Neither constraint means what it looks like, and they are wrong in opposite directions. `salutationId` is not listed in `required` and is required anyway. `navigationId` declares a UUID pattern that is not enforced: `""` passes and the call answers `200`. Take the schema as a description of the shape, not as the validation you will actually meet.

`salutationId` is the field where that optionality is a lie. The schema leaves it out of `required`, but the platform's contact form validation requires it unconditionally, so both `""` and an omitted field come back as a `400` pointing at `/salutationId`. Treat it as required, and read the next section for what to preselect.

`ApiError` is optional throughout — `detail?`, `title?`, `code?`, `source?: { pointer? }` — so type an error list as `ApiError[]` and reach into it with `error.source?.pointer`, never `error.source.pointer`.

## Minimal Vue Example

<CodeExample title="Minimal contact form">

```vue
<script setup lang="ts">
import { ApiClientError, isTimeoutError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { getTranslatedProperty } from "@shopware/helpers";

import type { CmsElementForm } from "@shopware/composables";

import type { operations } from "#shopware";

// the form is a CMS element, so the element is what carries its configuration
const { content } = defineProps<{ content: CmsElementForm }>();

const { apiClient } = useShopwareContext();
const { getSalutations } = useSalutations();
const { foreignKey } = useNavigationContext();
const { getConfigValue } = useCmsElementConfig(content);

// `||` rather than `??`: getConfigValue yields `false` for a mapped source and
// `""` for a value left blank in the administration, and neither should render
const title = computed(() => getConfigValue("title") || "Contact");

// the schema declares no response content, so `invoke` types `data` as `never`
type ContactFormResult = { individualSuccessMessage?: string };

const sentMessage = ref("");

// the response carries the confirmation the backend resolved, which is the only
// copy that reflects a category override; the slot config is the fallback
const confirmation = computed(
  () =>
    sentMessage.value ||
    getConfigValue("confirmationText") ||
    "We have received your message and will get back to you shortly.",
);

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

const notSpecifiedId = computed(
  () =>
    getSalutations.value.find(
      (salutation) => salutation.salutationKey === "not_specified",
    )?.id ?? "",
);

watch(
  notSpecifiedId,
  (id) => {
    if (!form.salutationId) form.salutationId = id;
  },
  { immediate: true },
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
    const { data } = await apiClient.invoke(
      "sendContactMail post /contact-form",
      {
        body: {
          ...form,
          // resolves the element's own mailReceiver and confirmation text
          slotId: content.id,
          // overrides that with a category's configuration when present
          navigationId: foreignKey.value || undefined,
        },
      },
    );

    sentMessage.value =
      (data as unknown as ContactFormResult | undefined)
        ?.individualSuccessMessage ?? "";
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
    <h2 ref="heading" tabindex="-1">
      {{ formSent ? "Thank you" : title }}
    </h2>

    <p v-if="formSent" role="status">{{ confirmation }}</p>

    <form v-else @submit.prevent="submit">
      <p v-if="formError" role="alert">{{ formError }}</p>

      <label for="salutation">Salutation</label>
      <select
        id="salutation"
        v-model="form.salutationId"
        :disabled="!getSalutations.length"
        :aria-invalid="errorsByField.salutationId ? 'true' : undefined"
        :aria-describedby="
          errorsByField.salutationId ? 'salutation-error' : undefined
        "
      >
        <option
          v-for="salutation in getSalutations"
          :key="salutation.id"
          :value="salutation.id"
        >
          {{ getTranslatedProperty(salutation, "displayName") }}
        </option>
      </select>
      <p v-if="errorsByField.salutationId" id="salutation-error" role="alert">
        {{ errorsByField.salutationId }}
      </p>

      <label for="first-name">First name</label>
      <input
        id="first-name"
        v-model="form.firstName"
        type="text"
        autocomplete="given-name"
        required
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
        required
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
        required
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

      <input
        id="consent"
        v-model="consentGiven"
        type="checkbox"
        aria-required="true"
      />
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

It carries `aria-required` rather than native `required`, and that is the one attribute choice worth arguing about. Native `required` on a checkbox makes the browser refuse the submit before the event fires, so `submit` never runs, `canSubmit` never gets a say, and the customer gets the browser's own bubble instead of `submitHint`. The other fields keep native `required` because there the browser's message is the one you want; consent is the field whose refusal the example explains itself.

Two details are worth copying. The `|| undefined` guard on `navigationId` is tidiness rather than a fix: an empty value is ignored, not rejected, which is why `SwContactForm` has posted `foreignKey.value` unguarded since 2022 without anyone noticing. Omitting the field says what you mean — you have no category — and keeps the request honest about it.

`salutationId` gets the opposite treatment, because omitting it is not allowed either. The example preselects the shop's `not_specified` salutation as soon as the list arrives, which is a real UUID the API accepts, and leaves the user free to change it. `SwContactForm` does neither: it keeps `salutationId` at `""`, has no validation rule for it, and renders no error line for it — so its first submit fails with a `400` the customer never sees.

A successful call does come back with something, just not an identifier: `individualSuccessMessage` carries the resolved confirmation text. `formSent` therefore stays local — it is the flag, not the copy — while the message is the one part of the success state worth taking from the response. The `catch` splits three ways because the three failures need different copy. A timeout is not an `ApiClientError` at all — it has no HTTP status and `isTimeoutError` is the only way to recognise it — and it must not invite a resend, because the mail may already have gone out. An `ApiClientError` carries the shop's own validation, which is where a field your form treated as optional turns out to be required. Anything else is a network failure.

`error.details` is the raw response body, not a parsed envelope: a proxy that answers with an HTML error page makes it a string, so `details?.errors ?? []` is load-bearing rather than defensive. `ApiError` is optional throughout, which is why `errorsByField` falls back through `detail` to `title` to its own copy, and why an error with no `source.pointer` falls out of the map into the form-level message instead of vanishing. Never render `detail` unfiltered — when the response body is empty the client substitutes a developer-facing placeholder that tells the customer to check their network tab.

Four things in the markup are deliberate. The heading is focusable and receives focus after a successful submit, because the form holding focus unmounts and a screen reader would otherwise never learn the message went out. The confirmation is a `role="status"` and every error is a `role="alert"`, because by the time they render the button has been re-enabled and focus is nowhere near them. The submit button carries `aria-disabled` rather than `disabled` — a disabled control cannot hold focus or explain itself, so the button would simply disappear from the tab order with no statement of why — and `canSubmit` is one computed read by both the button and `submit`, never two conditions kept in sync by hand. That only works because the consent checkbox uses `aria-required`: native `required` would hand the refusal back to the browser before either of them ran. Each field's message is wired to its control with `aria-describedby` and `aria-invalid`, which is what makes `source.pointer` worth reading in the first place.

The salutation select is disabled until the list arrives. `useSalutations` fetches in `onMounted`, so the list is never part of the server-rendered HTML and `getSalutations` is `[]` for the whole first-paint-to-fetch window. The composable exposes no pending flag, so if you want the list in the SSR payload or a real loading state, fetch it yourself — `vue-starter-template` does exactly that in `app/components/form/SalutationSelect.vue`, with `useAsyncData` plus `getCachedData` and an `isLoading` derived from `status`, rather than through `useSalutations`.

The title and the confirmation come from the element's own config, with `||` rather than `??` so that a mapped source or a value left blank in the administration falls back to readable copy instead of rendering `false` or nothing — which is the trap `SwContactForm` walks into with `??` on `confirmationText`.

## State And Session

The form's own state is entirely local: the form data, the success flag and the errors all live in the component. What the recipe reads from outside are three injected values — `swSalutations`, `navigation` and `cmsTranslations` — and none of them is application-wide.

`swSalutations` is the one worth understanding, because its name suggests a global. `useSalutations` does `inject("swSalutations", ref())` followed by `provide("swSalutations", _salutations)`, and nothing in the packages or the templates provides that key at the application root. `provide` only reaches descendants, and the `ref()` default is created fresh on every call, so two callers that are siblings rather than ancestor and descendant each get their own list. That is not hypothetical for this recipe: `SwNewsletterForm` calls `useSalutations` too, so a page carrying a contact form element and a newsletter form element fetches the salutation list twice and holds two copies of the result. Both requests take whichever route `cacheableReads` selects, so in `vue-starter-template` that is two `GET /salutation` calls, not two `POST`s — and the duplication survives either way, because the shared ref never reaches both callers.

Adding an application-root `provide("swSalutations", ref())` makes the two share one ref but does not reduce the request count, because both `onMounted` hooks run before either fetch assigns and the `if (!_salutations.value)` guard is therefore still `true` in both. If one request is what you want, fetch the list through `useAsyncData` under a shared key — the way `vue-starter-template` does in `app/components/form/SalutationSelect.vue` — rather than relying on the composable's injection.

The submission still runs in the session identified by the `sw-context-token`, which is how the shop resolves the sales channel and therefore the language of the mail. It does not require a logged-in customer, and it does not read the customer's details — a logged-in visitor still types their email address into the form.

`slotId` and `navigationId` are the two pieces of context that change what the backend does, and they are not interchangeable. `slotId` selects the element's own configuration — `mailReceiver`, `defaultMailReceiver` and `confirmationText` all live in `FormElementConfig`, so without the slot id the backend has no element config to read and falls back to the shop default. `navigationId` then overrides whatever was resolved with a category's settings, which is exactly the word the schema uses for it.

Send both from an element override: `slotId` from `content.id`, which `CmsSlot` always carries, and `navigationId` from `useNavigationContext().foreignKey` when the context reaches you.

## Edge Cases

- A default installation requires seven fields, not the three the schema names: `salutationId` unconditionally, plus `firstName`, `lastName` and `phone` from settings that ship enabled. Submitting only `email`, `subject` and `comment` answers `400` for the other four.
- Those three settings can be switched off per shop, so seven is the default rather than the contract. A `400` on a field you left optional, and a shop that accepts a field you made mandatory, are both normal.
- The shipped `SwContactForm` looks stricter than the schema but is not: its rules require `firstName`, `lastName` and `phone` precisely because a default shop does. The schema is the outlier here, not the component. Its own `comment` minimum of 10 characters is invented, though, and it has no rule for `salutationId` at all — the one field the backend always requires.
- The `200` carries `individualSuccessMessage` on a default installation, although the schema declares no response content and the generated type is therefore `never`. Reading it needs a cast; the field can also be `""`, so keep a fallback.
- What the `200` does not carry is an identifier. There is no submission id, so a duplicate submit cannot be detected or deduplicated after the fact.
- The success flag is local whatever the response says. Leaving the form fillable after a success invites a second identical mail.
- `individualSuccessMessage` is the resolved confirmation text, so it is the only value that reflects a category override. `getConfigValue("confirmationText")` reads the slot's copy and cannot see that override — prefer the response and fall back to the config.
- `salutationId` is required by the backend although the schema does not list it. Both `""` and an omitted field answer `400` with `source.pointer` `/salutationId`. Preselect the salutation whose `salutationKey` is `not_specified` rather than starting the select on an empty value, and render an error line for the select so the failure is visible if the shop has no such salutation.
- `navigationId` declares `pattern: ^[0-9a-f]{32}$`, but the pattern is not enforced: posting `""` is ignored and answers `200`. The failure is silent rather than loud — the category override you expected simply does not happen. Omit the field when `foreignKey` is `""` so the request states the absence instead of hiding it.
- `salutationId` is a UUID, not a label. Loading the salutation list is a prerequisite for that field, and `useSalutations().getSalutations` is the list rather than a loader.
- A privacy consent checkbox has no field on the body. Spreading a form state that contains one sends an undeclared property — the CMS base layer's own component does exactly that.
- `slotId` is what resolves the element's own configuration, so omitting it is not a neutral choice: the mail then goes to the shop's default address with an empty message, whatever the element was configured with in the administration. `cmsPageType` and `entityName` exist for the same resolution — `entityName` is documented as "Entity name for slot config".
- `navigationId` and `slotId` are not alternatives. With both, the category's configuration wins; with `slotId` alone, the element's applies; with `navigationId` alone, neither does.
- The shipped `SwContactForm` sends neither `slotId`, `cmsPageType` nor `entityName`, although `content.id` is right there in its props. An element-level `mailReceiver` therefore has no effect on it.
- The CMS element is a form element, not a contact form element. `CmsElementForm` branches on `getConfigValue("type")`, so an override that assumes "contact form" breaks the newsletter variant.
- HTTP failures arrive as an `ApiClientError`. Each entry in `details.errors` _may_ carry a `detail` and a `source.pointer` identifying the field — both are optional on `ApiError`, so read them as `error.source?.pointer` and fall back to `error.title`.
- `error.details` is the raw response body, not a guaranteed envelope. It is `response._data`, so a proxy answering with an HTML error page makes it a string and `details.errors` `undefined`; read it as `error.details?.errors ?? []`. When the body is empty the client substitutes its own placeholder entry whose `detail` reads "API did not return errors, but request failed. Please check the network tab." — never render that to a customer.
- Timeouts and network failures are **not** `ApiClientError`. They carry no HTTP status, so check `isTimeoutError(error)` before branching on `error.status`. A timeout is the dangerous one: the request may already have reached the API and been processed, so its copy must not invite a resend.
- Nothing in the composables carries a request deadline. Configure `apiClientConfig.timeout`, or a request that never settles leaves the form on "Sending…" with no error and no way out.
- Do not treat the schema's list of responses as the set of statuses you can get. Which ones it enumerates varies by Shopware version, and the list is demonstrably incomplete either way — the `400` this page documents for `/salutationId` is real whether or not your copy of the schema mentions it. What is stable is that `api-gen` keeps only the `2xx`, so the operation types as `responseCode: 200` and the type system tells you nothing about failures. Classify them yourself from `error.status` rather than treating all failures alike.
- The salutation list is fetched in `onMounted`, so it is never in the server-rendered HTML and `getSalutations` is `[]` until the fetch resolves. `useSalutations` exposes no pending flag, so gate the select on the list's length or fetch it yourself.
- The mail's language follows the sales channel resolved from the context, not from anything in the body — see the [Language and currency recipe](../context/language-and-currency.html) for what moves that context. The operation does accept a `sw-language-id` header, but the schema documents it only as "Instructs Shopware to return the response in the given language", so do not reach for it to steer the mail.

## Common Mistakes

- Do not build the form from the schema's `required` list. It names three fields; a default shop wants seven.
- Do not spread a form state containing a consent checkbox into the request body.
- Do not start the salutation select on `""`, and do not omit `salutationId` to work around it. Both fail — preselect the `not_specified` salutation instead.
- Do not leave the salutation select without an error line. It is the one field the backend requires that the schema does not, so a silent failure lands exactly there.
- Do not read a `200` as proof `navigationId` was understood. An empty one is ignored, so a missing category override looks exactly like a successful send.
- Do not drop the `getConfigValue("type")` switch when overriding `CmsElementForm`, and do not put the override outside a directory registered `global: true` — it will never render.
- Do not leave the form on screen after a successful submit.
- Do not expect an identifier back to confirm the submission. A body does come back, but it holds copy, not an id.
- Do not take the generated `response: never` as proof the endpoint is silent. It mirrors a gap in the schema, not the runtime.
- Do not render a salutation select before the salutation list has loaded.
- Do not call `getSalutations()` as a function. It is the list.
- Do not omit `slotId`. It is what makes the element's configured receiver and confirmation text apply at all.
- Do not treat `navigationId` as the way to select a configuration. It overrides one; on its own it selects nothing.
- Do not render the raw `detail` of every API error as one blob. Map them onto fields with `source.pointer`, and keep your own copy for the ones that carry no pointer.
- Do not read `error.details.errors` unguarded. A non-JSON error body makes `details` a string, and the unguarded read crashes the form's render.
- Do not tell the customer a timed-out submission failed. Check `isTimeoutError` first — the mail may already be on its way.
- Do not retry automatically on failure. Without an id you cannot tell whether the first attempt went through.
- Do not assume `useSalutations` shares one list across the page. Sibling components each get their own.

## Testing Checklist

- The salutation select is populated from `readSalutationGet get /salutation` when `cacheableReads` is on, and from `readSalutation post /salutation` when it is off. Assert whichever your `nuxt.config` selects — `vue-starter-template` ships the flag on.
- The salutation select is inert until the list arrives, and the server-rendered HTML does not claim the list is empty.
- Submitting calls `sendContactMail post /contact-form` exactly once.
- The request body carries `slotId` from the element, so a receiver configured on the element is the one that gets the mail.
- The request body carries `navigationId` from the navigation context on a category page, and the component is mounted somewhere that navigation context actually reaches.
- The salutation select is preselected on the `not_specified` salutation once the list has loaded, and the submitted body carries that id.
- A `400` pointing at `/salutationId` renders an error on the select rather than nowhere.
- The request body does not carry the consent checkbox.
- `CmsElementForm` still renders the newsletter form when the element's `type` is `newsletter`.
- A successful submit replaces the form with `individualSuccessMessage` from the response, falls back to the slot's `confirmationText` when that field is `""`, and moves focus to the heading.
- Submitting without consent is refused by the handler, not only by the button's appearance. If the consent checkbox ever regains native `required`, this assertion starts passing for the wrong reason — the browser blocks the submit and the handler is never reached.
- A `400` naming a field the form treated as optional is shown on that field, wired to it with `aria-describedby`.
- A rejection whose entries carry no `source.pointer` still produces a visible form-level message.
- An error response with a non-JSON body shows a form-level message instead of crashing the render.
- A timed-out submission does not tell the customer to send the message again.
- A network failure shows a form-level error and keeps the entered text.
- The form is not re-submittable after a success without a reload.

## Related Links

- [Newsletter recipe](../account/newsletter.html)
- [Language and currency recipe](../context/language-and-currency.html)
- [URL Resolving and SEO URLs recipe](../context/url-resolving.html)
- [Create content pages](../../guides/cms/content-pages.html)
- [Create elements](../../guides/cms/create-elements.html)
- [Overwriting CMS components](../../guides/cms/overwriting-cms.html)
- [Custom CMS elements](../../guides/cms/custom-elements.html)
- [Composables reference](../../packages/composables/)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [API client package](../../packages/api-client.html)
