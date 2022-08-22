<script setup lang="ts">
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
const { navigationElements } = useNavigation();

const currentMenuPosition = ref<string | null>(null);

const menuHtmlElement = ref(null);

onClickOutside(menuHtmlElement, () => (currentMenuPosition.value = null));
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <nav class="hidden md:flex space-x-10">
    <div
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
      ref="menuHtmlElement"
      class="relative"
      @mouseover="currentMenuPosition = navigationElement.id"
    >
      <router-link
        :to="'/' + navigationElement.seoUrls[0]?.seoPathInfo"
        class="text-base font-medium text-gray-500 hover:text-gray-900"
      >
        {{ getTranslatedProperty(navigationElement, "name") }}
      </router-link>

      <!--
            Flyout menu, show/hide based on flyout menu state.

            Entering: "transition ease-out duration-200"
              From: "opacity-0 translate-y-1"
              To: "opacity-100 translate-y-0"
            Leaving: "transition ease-in duration-150"
              From: "opacity-100 translate-y-0"
              To: "opacity-0 translate-y-1"
          -->
      <div
        v-if="
          currentMenuPosition === navigationElement.id &&
          navigationElement?.children?.length
        "
        class="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
        @mouseleave="currentMenuPosition = null"
      >
        <div
          class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div
            v-for="childElement in navigationElement.children"
            :key="childElement.id"
            class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-6 sm:pb-0"
          >
            <router-link
              :to="'/' + childElement.seoUrls[0]?.seoPathInfo"
              class="flex justify-between rounded-lg hover:bg-gray-50"
            >
              <div
                class="flex flex-col flex-grow pl-2"
                :class="{ 'max-w-200px': !!childElement.media }"
              >
                <p class="text-base font-medium text-gray-900">
                  {{ getTranslatedProperty(childElement, "name") }}
                </p>
                <p
                  v-if="getTranslatedProperty(childElement, 'description')"
                  class="mt-1 text-sm text-gray-500"
                  v-html="getTranslatedProperty(childElement, 'description')"
                />
              </div>
              <div v-if="childElement.media" class="flex">
                <img :src="childElement.media?.url" class="w-150px h-auto" />
              </div>
            </router-link>
          </div>
          <div
            class="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8"
          >
            <div
              class="flow-root"
              v-html="getTranslatedProperty(navigationElement, 'description')"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
