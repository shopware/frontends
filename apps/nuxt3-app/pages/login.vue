<script setup lang="ts">
const { push } = useRouter();
const { logout, isLoggedIn } = useUser();

const navigateTo = (path = "/") => push(path);

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await logout();
  }
});
</script>

<script lang="ts">
export default {
  name: "LoginPage",
};
</script>

<template>
  <div class="login-wrapper">
    <SwLoginForm @success="navigateTo('/')">
      <div class="flex items-center justify-end">
        <div class="text-sm">
          <nuxt-link
            to="/account/recover"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </nuxt-link>
        </div>
      </div>

      <template #action>
        <nuxt-link
          to="/register"
          class="w-full flex justify-center py-2 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign up
        </nuxt-link>
      </template>
    </SwLoginForm>
  </div>
</template>
