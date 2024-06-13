---
head:
  - - meta
    - name: og:title
      content: "Error Handling: API Client"
  - - meta
    - name: og:description
      content: "Example how to handle API errors with the API Client."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Error handling: **API Client**.png?fontSize=110px"
nav:
  position: 40
---

# Error Handling: API Client

:::warning
Deprecated. This doc is based on the old API client.
:::

## Overview

The api-client is a separate package located at `packages/api-client` and it uses [axios](https://axios-http.com/) internally.
There is an `errorInterceptor` (see [axios interceptors](https://axios-http.com/docs/interceptors)) used inside the `apiService` that intercept the response we get returned from our requests. So we extend the default `AxiosError` with more specific `ShopwareError` messages.

When there is an error returend from a request you can expect at least the following fields: `message`, `code` and `errors` (containing an array with one or multiple `ShopwareError` objects). You can find the type definition at `packages/types/shopware-6-client/errors/ApiError.d.ts`.

### Structure

Let's say we want to use the `getCustomerRegisterEndpoint` which points to `/store-api/account/register`. These function is used inside the `customerService` by an async function called `register` and returning a promise with an Customer object. Further the `register` function is used inside a composable called `useUser()`. There is also a function called `register` that is wrapping the `register` function from the API client. When you now look at the `register.vue` page inside the vue-demo-store implementation, you will see, that the submit of the form is invoked.

**So the way is like this:**  
API client Endpoint (TS) **>** API client Service (TS) **>** Composable (TS) **>** Vue

## Example (Vue page/template)

Look at this `invokeSubmit` function from `templates/vue-demo-store/pages/register.vue`

```js
<script setup lang="ts">
    const { register } = useUser();
    const { pushError } = useNotifications();

    //... content reduced

    const invokeSubmit = async () => {
    $v.value.$touch();
    const valid = await $v.value.$validate();
    if (valid) {
        try {
            loading.value = true;
            const response = await register(state);
            if (response) router.push("/");
        } catch (error) {
            let message = (error as ClientApiError)?.messages?.[0]?.detail || "Something went wrong, please try again later";
            pushError(message);
        } finally {
            loading.value = false;
        }
    }
    };

    //... content reduced
</script>
```

Before some request is sent the form get's validated and if it is valid, we will send the register request. The `await register(state);` part is coming from the composable `useUser()`, you see at the top of the script setup. So the request is surrounded by a try/catch/finally (see also [axios errors handling](https://axios-http.com/docs/handling_errors)) so it is possible to react if there is some error coming back from the request. If we got an error we will push a message to a composable called `useNotifications()` that will display a nice message to the user of the website.

**API Client Reference**
<PageRef page="../../packages/api-client" title="API Client Reference" sub="Package reference with all services" />
