<script lang="ts" setup>
const { push } = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { mergeWishlistProducts } = useWishlist();
const { login } = useUser();

const emit = defineEmits<{
  close: [];
}>();

async function handleLogin(formData) {
  await login(formData);
  mergeWishlistProducts();
  emit("close");
}

function handleSignUp() {
  push(formatLink("/register"));
}
</script>
<template>
  <div class="w-100 flex flex flex-col gap-3 m-auto p-5">
    <div class="mb-4">
      <h3 class="text-2xl font-bold">{{ $t("loginForm.header") }}</h3>
      <p class="text-sm text-text-bg-surface-surface-disabled">
        {{ $t("loginForm.subHeader") }}
      </p>
    </div>

    <LoginForm @submit="handleLogin" />
    <FormBaseButton
      :label="$t('loginForm.signUpButtonLabel')"
      variant="secondary"
      @click="handleSignUp"
    />
  </div>
</template>
