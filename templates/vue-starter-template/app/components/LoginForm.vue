<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";

type LoginForm = {
  username: string;
  password: string;
};

const model = ref<LoginForm>({
  username: "",
  password: "",
});

const $v = useVuelidate(loginFormRules(), model);

const emit = defineEmits<{
  submit: [LoginForm];
}>();

async function handleSubmit() {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    emit("submit", model.value);
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="gap-3 flex flex-col">
    <FormInputField
      id="username"
      v-model="model.username"
      autocomplete="username"
      :label="$t('loginForm.loginLabel')"
      :errorMessage="$v.username.$errors[0]?.$message"
    />
    <FormInputField
      id="password"
      v-model="model.password"
      autocomplete="current-password"
      type="password"
      :label="$t('loginForm.passwordLabel')"
      :errorMessage="$v.password.$errors[0]?.$message"
    />
    <FormBaseButton :label="$t('loginForm.submitButtonLabel')" type="submit" />
  </form>
</template>
