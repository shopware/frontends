<script setup lang="ts">
    const loginCredentials = reactive({
        username: "",
        password: "",
    })
    const invokeLogin = () => {}
</script>
<template>
    <div>
        <input type="text" v-model="loginCredentials.username" />
        <input type="password" v-model="loginCredentials.password" />

        <button @click="invokeLogin">Sign in</button>
    </div>
</template>
