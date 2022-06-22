<script setup lang="ts">
const { loadNavigationElements, navigationElements } = useNavigation();

const currentMenuPosition = ref(null);

onMounted(() => {
  loadNavigationElements({ depth: 2 });
});

const menuHtmlElement = ref(null);

onClickOutside(menuHtmlElement, () => (currentMenuPosition.value = null));
</script>

<template>
  <nav class="hidden md:flex space-x-10">
    <div
      class="relative"
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
      @mouseover="currentMenuPosition = navigationElement.id"
      ref="menuHtmlElement"
    >
      <router-link
        :to="'/' + navigationElement.seoUrls[0]?.seoPathInfo"
        class="text-base font-medium text-gray-500 hover:text-gray-900"
      >
        {{ navigationElement.translated.name }}
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
        class="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
        v-if="
          currentMenuPosition === navigationElement.id &&
          navigationElement.children.length
        "
        @mouseleave="currentMenuPosition = null"
      >
        <div
          class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div
            class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-6 sm:pb-0"
            v-for="childElement in navigationElement.children"
            :key="childElement.id"
          >
            <router-link
              :to="'/' + childElement.seoUrls[0]?.seoPathInfo"
              class="flex justify-between rounded-lg hover:bg-gray-50"
            >
              <div class="flex flex-col flex-grow pl-2">
                <p class="text-base font-medium text-gray-900">
                  {{ childElement.translated.name }}
                </p>
                <p
                  class="mt-1 text-sm text-gray-500"
                  v-if="childElement.translated.description"
                  v-html="childElement.translated.description"
                />
              </div>
              <div class="flex" v-if="childElement.media">
                <img :src="childElement.media?.url" class="w-150px h-auto" />
              </div>
            </router-link>
          </div>
          <div
            class="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8"
          >
            <div
              class="flow-root"
              v-html="navigationElement.translated.description"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
