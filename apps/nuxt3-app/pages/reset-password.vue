<script lang="ts">
export default {
  name: "ResetPassword",
};
</script>

<template>
  <div class="reset-password-wrapper">
    <SwResetPasswordForm>
      <template #action>
        <nuxt-link
          to="/"
          class="w-full flex justify-center py-2 px-4 border border-brand-primary text-sm font-medium rounded-md text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          Return to Homepage
        </nuxt-link>
      </template>
    </SwResetPasswordForm>
  </div>
</template>
