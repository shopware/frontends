<script setup lang="ts">
import { ApiClientError, isTimeoutError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import type { CmsElementForm } from "@shopware/composables";
import { getTranslatedProperty } from "@shopware/helpers";

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
