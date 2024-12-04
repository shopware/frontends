<script setup lang="ts">
import type { RouteObject } from "@shopware-pwa/composables-next";
import type { NuxtError } from "#app";

defineOptions({
  name: "ErrorPage",
});

const props = defineProps<{
  error: NuxtError<{
    statusCode: number;
    statusMessage: string;
    message: string;
  }>;
}>();

const isMaintenanceMode = computed(() => {
  return props.error.statusMessage === "MAINTENANCE_MODE";
});

let isFormattedError = true;
let errMessage = "";
let linkFormatter = (path: string | RouteObject) => path;

try {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const { formatLink } = useInternationalization(localePath);
  linkFormatter = formatLink;

  const errorMessageMap: { [key: number]: string } = {
    404: t("errorPages.404"),
    408: t("errorPages.408"),
    500: t("errorPages.500"),
    502: t("errorPages.502"),
    503: t("errorPages.503"),
  };

  errMessage =
    errorMessageMap[props.error.statusCode as keyof typeof errorMessageMap] ||
    props.error.message;

  console.error("[error.vue]:", props.error?.message);

  if (props.error.statusCode === 412) {
    // setting a timeout here to ensure we are the last error message in terminal
    setTimeout(() => {
      console.error(
        "Looks like your API connection is not working. Check your _nuxt.config.ts_ configuration (shopware.endpoint and shopware.accessToken). 🤞",
      );
      console.error(
        "For more help ➡️  https://frontends.shopware.com/resources/troubleshooting.html",
      );
    }, 2.0 * 1000);
  }
} catch (e) {
  console.error("Problem with loading error page", e);
  isFormattedError = false;
}

const statusCode = isFormattedError ? props.error.statusCode : "Error";
const errorMessage = isFormattedError ? errMessage : props.error.message;
</script>

<template>
  <ErrorsMaintainMode v-if="isMaintenanceMode" />
  <div
    v-else
    class="px-5 py-3 md:py-20 md:px-32 lg:px-24 lg:py-24 items-center flex justify-center flex-col-reverse lg:flex-row"
  >
    <div class="flex flex-col items-center justify-center my-8">
      <div class="max-w-md text-center">
        <h1 class="mb-4 font-extrabold text-9xl">
          <span class="sr-only">{{ $t("error") }}</span
          >{{ statusCode }}
        </h1>
        <p
          v-if="errorMessage"
          class="text-xl md:text-3xl font-semibold mt-4 mb-6"
        >
          {{ errorMessage }}
        </p>
        <DevOnly>
          <div class="text-xs text-gray-500">
            {{ $t("setup.check_console") }}
          </div>
          <div class="block m-4">
            <p>{{ $t("setup.problems") }}</p>
            <p>
              {{ $t("setup.support_start") }}
              <a
                class="text-primary"
                href="https://frontends.shopware.com/resources/troubleshooting.html"
                target="_blank"
                >{{ $t("setup.support_page") }}</a
              >. {{ $t("setup.support_end") }}
            </p>
          </div>
        </DevOnly>
        <NuxtLink
          :to="isFormattedError ? linkFormatter(`/`) : `/`"
          class="block w-full lg:w-auto justify-center py-3 px-8 border shadow-sm text-sm font-medium rounded-md text-white bg-light hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
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
