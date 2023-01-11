---
nav:
  position: 60
---

<script setup>
import StackBlitzLiveExample from '../components/StackBlitzLiveExample.vue'
</script>

# Create a login form

In this chapter, you will learn how to

- Sign in using username and password
- Display data of an authenticated user
- Display authentication errors
- Logout

## Build the form

Let us start by providing some reactive objects and input elements to get customer login credentials from the browser.

```vue{3,4,10,11}
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
```

## Manage the user session

Now, the presentation layer has all required fields to perform a login process.

In the next step, use the `useUser` composable. It provides user data, login methods, and other interfaces.

```vue
<script setup lang="ts">
const {
  login, // login method, accepts username and password
  logout, // performing a logout
  errors, // errors from API prefixed with a method name, which is the source of the problem
  isLoggedIn, // flag that says if customer is logged in
  user, // the whole customer object
} = useUser();

const invokeLogin = () => login(loginCredentials);
</script>
...
```

The `invokeLogin` method is triggered using the `@click` event of the button. It executes the `login()` method from the `useUser` composable, accepting `loginCredentials` (the `v-model` of inputs) as an argument.

## Display user data

If the login process was successful, the `isLoggedIn` computed property becomes `true`. Now we can use `user` object to access customer data.

```vue{2,6}
<template>
  <div v-if="!isLoggedIn">
    <!-- DISPLAY FORM HERE -->
  </div>
  <div v-else>
    <h1>Hi, {{ user.firstName }}!</h1>
    <button @click="logout()">sign out</button>
  </div>
</template>
```

The example above shows the conditional visibility of content depending on the customer's logged in state.

## Handle authentication errors

To finish, we would like to inform the user about problems that may appear during the authentication.

In order to achieve it, the `errors` computed ref can be used:

```vue{5}
<template>
    <div v-if="!isLoggedIn">
        <div v-if="errors.login.length">
            {{ errors.login[0].detail }}
        </div>
    </div>
</template>
```

The example explains how to display only the first error that may appear in the response while processing the `login` method (see, the `errors` computed has prefixed `login` nested object).

## Full example

```vue
<script setup lang="ts">
const { logout, login, errors, isLoggedIn, user } = useUser();
const loginCredentials = reactive({
  username: "",
  password: "",
});
const invokeLogin = () => login(loginCredentials);
</script>
<template>
  <div v-if="!isLoggedIn">
    <h1>Sign in to your account</h1>
    <input type="text" v-model="loginCredentials.username" />
    <input type="password" v-model="loginCredentials.password" />
    <button @click="invokeLogin">sign in</button>
    <div v-if="errors.login.length">
      {{ errors.login[0].detail }}
    </div>
  </div>
  <div v-else>
    <h1>Hi, {{ user.firstName }}!</h1>
    <button @click="logout()">sign out</button>
  </div>
</template>
<style scoped>
.errors {
  color: red;
  margin-top: 10px;
}
</style>
```

<StackBlitzLiveExample projectId="mkucmus/frontends-examples" example="LoginForm" />
