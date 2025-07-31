<script setup lang="ts">
const { login } = useUser();
const state = reactive({
  username: "",
  password: "",
});

const loginAction = async () => {
  const session = login({
    username: state.username,
    password: state.password,
  });
  console.log(session);
};
</script>

<template>
  <form
    @submit.prevent="loginAction"
    class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
  >
    <div class="mb-4">
      <input
        type="text"
        placeholder="Username"
        v-model="state.username"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
      />
    </div>
    <div class="mb-6">
      <input
        type="password"
        placeholder="Password"
        v-model="state.password"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
    >
      Login
    </button>
  </form>
</template>
