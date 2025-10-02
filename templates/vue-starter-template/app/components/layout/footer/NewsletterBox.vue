<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { useVuelidate } from "@vuelidate/core";

const email = ref("");
const newsletterDisabled = ref(false);

const { newsletterSubscribe, SUBSRIBE_KEY } = useNewsletter();
const { pushSuccess, pushError } = useNotifications();
const { resolveApiErrors } = useApiErrorsResolver("newsletter_box");
const { t } = useI18n();

const $v = useVuelidate(footerNewsletterBoxRules(), { email });

async function handleSubmit() {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  console.log(valid);
  if (valid) {
    try {
      await newsletterSubscribe({
        email: email.value,
        option: SUBSRIBE_KEY,
      });

      pushSuccess(t("layout.footer.newsletter.messages.subscribed"));
    } catch (error) {
      if (error instanceof ApiClientError) {
        const errors = resolveApiErrors(error.details.errors);
        for (const error of errors) {
          pushError(error);
        }
      }
    } finally {
      newsletterDisabled.value = false;
    }
  }
}
</script>
<template>
  <div>
    <h3 class="mb-2 text-surface-inverse-on-surface">
      {{ $t("layout.footer.newsletter.title") }}
    </h3>
    <div class="mb-4 text-surface-surface-primary">
      {{ $t("layout.footer.newsletter.description") }}
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="flex gap-2">
        <div>
          <FormInputField
            id="newsletter-email"
            :class="[$v.email.$errors[0]?.$message ? 'mb-4' : 'mb-1']"
            v-model="email"
            :placeholder="$t('layout.footer.newsletter.placeholder')"
            @blur="$v.email.$touch()"
            :errorMessage="$v.email.$errors[0]?.$message"
            :disabled="newsletterDisabled"
          />
          <div class="text-surface-surface-primary text-xs leading-5">
            {{ $t("layout.footer.newsletter.privacyPolicy") }}
          </div>
        </div>
        <div>
          <FormBaseButton
            class="mt-0.5"
            type="submit"
            variant="secondary"
            size="small"
            :disabled="newsletterDisabled"
          >
            {{ $t("layout.footer.newsletter.button") }}
          </FormBaseButton>
        </div>
      </div>
    </form>
  </div>
</template>
