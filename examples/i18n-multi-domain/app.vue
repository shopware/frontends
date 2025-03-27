<script setup lang="ts">
const { t, locales, locale, availableLocales } = useI18n();
</script>
<template>
  <div class="p-4 container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Example - Multiple Domains</h1>
    <div
      class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <p class="mb-2">
        This example demonstrates how to use multiple domains with i18n.
      </p>
      <p class="mb-2">
        In this example, we assume that we have two main domains:
      </p>
      <ul class="list-disc list-inside mb-4">
        <li><b>local.de</b></li>
        <li><b>local.pl</b></li>
      </ul>
      <p class="mb-2">
        <b>local.de</b> is available in the following languages:
      </p>
      <ul class="list-disc list-inside mb-4">
        <li>de (main language)</li>
        <li>en</li>
        <li>fr</li>
      </ul>
      <p class="mb-2">
        <b>local.pl</b> is available in the following languages:
      </p>
      <ul class="list-disc list-inside">
        <li>pl (main language)</li>
        <li>en</li>
      </ul>
    </div>

    <h2>Generated config</h2>
    <p>For more info please check nuxt.config.ts file</p>
    <div class="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded relative">
      <pre class="whitespace-pre-wrap break-words">{{ locales }}</pre>
    </div>
    <div class="text-center mt-8 mb-20">
      <span class="text-2xl text-blue-600 font-semibold"> {{ t("hello") }}</span>
    </div>
  </div>
</template>
