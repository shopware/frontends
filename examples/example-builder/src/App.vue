<script setup lang="ts">
import { computed, onMounted } from "vue";
import { getStackBlitzProjectConfig } from "./helpers";
import sdk from "@stackblitz/sdk";
import { useRoute } from "vue-router";
// Import stylesheets
import "./style.css";

const route = useRoute();

const packageName = computed(() =>
  !Array.isArray(route.query.packageName)
    ? route.query.packageName?.toString()
    : route.query.packageName?.[0] || "@shopware-pwa/api-client",
);

const packageVersion = computed(() =>
  !Array.isArray(route.query.packageVersion)
    ? route.query.packageVersion?.toString()
    : route.query.packageVersion?.[0] || "latest",
);
const functionName = computed(() =>
  !Array.isArray(route.query.functionName)
    ? route.query.functionName?.toString()
    : route.query.functionName[0] || "getSessionContext",
);

const isAsync = computed(() => !!route.query.async || true);

const isConfigOk = computed(() => !!packageName.value && !!functionName.value);

const openExample = () => {
  if (!packageName.value || !functionName.value) {
    return;
  }
  sdk.openProject(
    getStackBlitzProjectConfig({
      packageName: packageName.value,
      packageVersion: packageVersion.value,
      functionName: functionName.value,
      isAsync: isAsync.value,
    }),
    { newWindow: false },
  );
};
// timeout to get the URL params
onMounted(() => setTimeout(openExample, 500));
</script>

<template>
  <div test-id="test-wrapper">
    <div v-if="isConfigOk">
      <div>Your example configuration:</div>
      <div class="settings">
        <pre>{{
          {
            packageName,
            packageVersion,
            functionName,
            isAsync,
          }
        }}</pre>
      </div>
    </div>
    <div v-else>
      <h2>Missing configuration</h2>
    </div>
  </div>
</template>

<style>
pre {
  text-align: left;
}

div.settings {
  text-align: left;
}
</style>
