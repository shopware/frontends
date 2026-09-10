<script lang="ts" setup>
import { useRegle } from "@regle/core";

type LoginForm = {
  username: string;
  password: string;
};

const model = ref<LoginForm>({
  username: "",
  password: "",
});

const { r$ } = useRegle(model, loginFormRules());

const emit = defineEmits<{
  submit: [LoginForm];
}>();

async function handleSubmit() {
  r$.$touch();
  const { valid } = await r$.$validate();

  if (valid) {
    emit("submit", model.value);
  }
}
</script>
<template>
  <form
    @submit.prevent="handleSubmit"
    data-testid="login-form"
    class="gap-3 flex flex-col"
  >
    <FormInputField
      id="username"
      data-testid="login-email-input"
      v-model="model.username"
      autocomplete="username"
      :label="$t('loginForm.loginLabel')"
      :errorMessage="r$.username.$errors[0]"
    />
    <FormInputField
      id="password"
      data-testid="login-password-input"
      v-model="model.password"
      autocomplete="current-password"
      type="password"
      :label="$t('loginForm.passwordLabel')"
      :errorMessage="r$.password.$errors[0]"
    />
    <FormBaseButton
      data-testid="login-submit-button"
      :label="$t('loginForm.submitButtonLabel')"
      type="submit"
    />
  </form>
</template>
