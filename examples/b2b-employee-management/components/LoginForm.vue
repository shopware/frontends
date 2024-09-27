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
  <form @submit.prevent="loginAction">
    <input type="text" placeholder="Username" v-model="state.username" />
    <input type="password" placeholder="Password" v-model="state.password" />
    <button type="submit">Login</button>
  </form>
</template>
