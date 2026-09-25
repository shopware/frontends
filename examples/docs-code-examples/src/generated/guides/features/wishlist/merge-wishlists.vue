<script setup lang="ts">
import { ref, useUser, useWishlist } from "#imports";

const { login } = useUser();
const { mergeWishlistProducts } = useWishlist();
const formData = ref({
  username: "",
  password: "",
});
const invokeLogin = async (): Promise<void> => {
  try {
    // Login function
    await login(formData.value);
    mergeWishlistProducts();
  } catch (error) {
    console.error(error);
  }
};
</script>
<template>
  <form @submit.prevent="invokeLogin">
    <div>
      <label for="email-address">Email address</label>
      <input
        id="email-address"
        v-model="formData.username"
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="Email address"
      />
    </div>
    <div>
      <label for="password" class="sr-only">Password</label>
      <input
        id="password"
        v-model="formData.password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
        placeholder="Password"
      />
    </div>
    <div>
      <button type="submit">Sign in</button>
    </div>
  </form>
</template>
