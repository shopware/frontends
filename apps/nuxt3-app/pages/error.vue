<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    errorCode?: number;
    errorMessage?: string;
  }>(),
  {
    errorCode: 404,
    errorMessage: "",
  }
);

const errorMessageMap: { [key: number]: string } = {
  404: "We can't find what you are looking for. Are you lost?",
  408: "The API is taking to long to respond",
  500: "Oops, something went terribly wrong",
  502: "Server couldn't complete your request. Please try again in few seconds.",
  503: "Server is really busy right now",
};

const errorMessage = props.errorMessage || errorMessageMap[props.errorCode];
</script>

<script lang="ts">
export default {
  name: "ErrorPage",
};
</script>

<template>
  <div
    class="px-5 py-3 md:py-20 md:px-32 lg:px-24 lg:py-24 items-center flex justify-center flex-col-reverse lg:flex-row"
  >
    <div class="flex flex-col items-center justify-center my-8">
      <div class="max-w-md text-center">
        <h1 class="mb-8 font-extrabold text-9xl">
          <span class="sr-only">Error</span>{{ errorCode }}
        </h1>
        <p class="text-xl md:text-3xl font-semibold mt-4 mb-8">
          {{ errorMessage }}
        </p>
        <nuxt-link
          to="/"
          class="w-full lg:w-auto justify-center py-3 px-8 border shadow-sm text-sm font-medium rounded-md text-white bg-brand-light hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          Go back home
        </nuxt-link>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <img
        class="w-full h-full max-w-md max-h-md"
        src="~/assets/error-background.png"
        alt="Error"
      />
    </div>
  </div>
</template>
