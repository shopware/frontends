<script lang="ts" setup>
const { push } = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { mergeWishlistProducts } = useWishlist();
const { login } = useUser();
const { pushSuccess } = useNotifications();
const { t } = useI18n();
const { handleApiError } = useApiErrorsResolver("account_login_form");
const route = useRoute();

const { hideSignUp = false } = defineProps<{
  hideSignUp?: boolean;
}>();

async function handleLogin(formData: { username: string; password: string }) {
  try {
    await login(formData);
    pushSuccess(t("account.messages.loggedInSuccess"));
    mergeWishlistProducts();

    const redirect = route.query.redirect as string | undefined;
    await push(redirect || formatLink("/"));
  } catch (error) {
    handleApiError(error);
  }
}

function handleSignUp() {
  push(formatLink("/account/login"));
}
</script>
<template>
  <div class="w-full flex flex-col gap-3 p-5">
    <div class="mb-4">
      <h3 class="text-2xl font-bold">{{ $t("loginForm.header") }}</h3>
      <p class="text-sm text-text-bg-surface-surface-disabled">
        {{ $t("loginForm.subHeader") }}
      </p>
    </div>

    <LoginForm @submit="handleLogin" />
    <FormBaseButton
      v-if="!hideSignUp"
      :label="$t('loginForm.signUpButtonLabel')"
      variant="secondary"
      @click="handleSignUp"
    />
  </div>
</template>
