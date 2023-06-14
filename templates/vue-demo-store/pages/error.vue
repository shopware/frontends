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
const { t } = useI18n();
const localePath = useLocalePath();

const errorMessageMap: { [key: number]: string } = {
  404: t("errorPages.404"),
  408: t("errorPages.408"),
  500: t("errorPages.500"),
  502: t("errorPages.502"),
  503: t("errorPages.503"),
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
          <span class="sr-only">{{ $t("error") }}</span
          >{{ errorCode }}
        </h1>
        <p class="text-xl md:text-3xl font-semibold mt-4 mb-8">
          {{ errorMessage }}
        </p>
        <NuxtLink
          :to="localePath(`/`)"
          class="w-full lg:w-auto justify-center py-3 px-8 border shadow-sm text-sm font-medium rounded-md text-white bg-brand-light hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {{ $t("goBackHome") }}
        </NuxtLink>
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
