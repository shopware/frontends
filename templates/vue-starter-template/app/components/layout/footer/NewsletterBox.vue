<script setup lang="ts">
import { useRegle } from "@regle/core";

const email = ref("");
const newsletterDisabled = ref(false);

const { newsletterSubscribe, SUBSRIBE_KEY } = useNewsletter();
const { pushSuccess } = useNotifications();
const { t } = useI18n();
const { handleApiError } = useApiErrorsResolver("newsletter_box_form");

const { r$ } = useRegle({ email }, footerNewsletterBoxRules());

async function handleSubmit() {
  r$.$touch();
  const { valid } = await r$.$validate();

  if (valid) {
    try {
      newsletterDisabled.value = true;
      await newsletterSubscribe({
        email: email.value,
        option: SUBSRIBE_KEY,
      });

      pushSuccess(t("layout.footer.newsletter.messages.subscribed"));
    } catch (error) {
      handleApiError(error);
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
            :class="[r$.email.$errors[0] ? 'mb-4' : 'mb-1']"
            v-model="email"
            :placeholder="$t('layout.footer.newsletter.placeholder')"
            @blur="r$.email.$touch()"
            :errorMessage="r$.email.$errors[0]"
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
