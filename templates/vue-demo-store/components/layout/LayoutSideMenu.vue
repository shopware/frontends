<script setup lang="ts">
import { getTranslatedProperty, getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
import { RouterLink } from "vue-router";
import {
  getCategoryUrl,
} from "@shopware-pwa/helpers-next";
import { Category, StoreNavigationElement } from "@shopware-pwa/types";
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue';
import {
  XMarkIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const { navigationElements } = useNavigation();

const currentNavigationElement = ref<StoreNavigationElement | null>();
const currentChildNavigationElement = ref<StoreNavigationElement | null>();

const isSideMenuOpened = inject("isSideMenuOpened", ref(false));

const close = () => {
  isSideMenuOpened.value = false;
  currentNavigationElement.value = null;
  currentChildNavigationElement.value = null;
}

const goBack = () => {
  if (currentChildNavigationElement.value) {
    currentChildNavigationElement.value = null;
  } else if (currentNavigationElement.value) {
    currentNavigationElement.value = null;
  }
}

const firstNavigate = (value: Category) => {
  currentNavigationElement.value = value;
  if (!value.childCount) {
    close();
  }
}

const secondNavigate = (value: Category) => {
  currentChildNavigationElement.value = value;
  if (!value.childCount) {
    close();
  }
}

</script>

<template>
  <button
    class="lg:hidden"
    aria-label="menu"
    @click="isSideMenuOpened = true"
  >
    <span class="sr-only">Open main menu</span>
    <Bars3Icon
      class="h-6 w-6"
      aria-hidden="true"
    />
  </button>
  <TransitionRoot
    :show="isSideMenuOpened"
    appear
    as="template"
  >
    <Dialog
      as="div"
      class="lg:hidden"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-in-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-300 ease-out"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-10 bg-gray-500 bg-opacity-60" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="duration-300 ease-in-out"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="duration-300 ease-out"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      >
        <DialogPanel class="fixed inset-y-0 z-50 right-0 w-full overflow-y-auto bg-white pt-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="relative h-fit pb-10">
            <div class="px-4 flex items-center justify-between">
              <div>
                <ChevronLeftIcon
                  v-if="currentNavigationElement || currentChildNavigationElement"
                  class="cursor-pointer h-6 w-6 text-gray-700"
                  aria-hidden="true"
                  @click="goBack"
                />
              </div>
              <div>
                <h4 class="font-medium text-lg">
                  Menu
                </h4>
              </div>
              <button
                type="button"
                class="-m-2.5 rounded-md p-2.5 text-gray-700 outline-none"
                @click="close"
              >
                <span class="sr-only">Close menu</span>
                <XMarkIcon
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div class="border-t border-gray-200 mt-6 flow-root relative">
              <div class="divide-y divide-gray-500/10">
                <div class="">
                  <template v-if="!currentNavigationElement && !currentChildNavigationElement">
                    <RouterLink
                      v-for="navigationElement in navigationElements"
                      :key="navigationElement.id"
                      :to="navigationElement.childCount ? '' : getCategoryUrl(navigationElement)"
                      class="font-medium cursor-pointer flex justify-between items-center border-b border-gray-200 px-4 block py-3 text-base leading-7 text-gray-700 hover:bg-gray-50"
                      @click="firstNavigate(navigationElement)"
                    >
                      {{ getTranslatedProperty(navigationElement, "name") }}
                      <ChevronRightIcon
                        v-if="navigationElement.childCount"
                        class="h-6 w-6"
                        aria-hidden="true"
                      />
                    </RouterLink>
                    <div class="my-6 mx-4 flex flex-col gap-8">
                      <template v-for="(navigationElement, index) in navigationElements" :key="navigationElement.id">
                        <div v-if="navigationElement.media" class="flex flex-col gap-4">
                          <img
                            :src="getSmallestThumbnailUrl(navigationElement.media)"
                            class="object-cover w-full aspect-square"
                            alt="Category image"
                          />
                          <div v-html="navigationElement.description" />
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-else-if="currentNavigationElement && !currentChildNavigationElement">
                    <RouterLink
                      v-for="navigationElement in currentNavigationElement.children"
                      :key="navigationElement.id"
                      :to="navigationElement.childCount ? '' : getCategoryUrl(navigationElement)"
                      class="font-medium cursor-pointer flex justify-between items-center border-b border-gray-200 px-4 block rounded-lg py-3 text-base leading-7 hover:bg-gray-50"
                      @click="secondNavigate(navigationElement)"
                    >
                      {{ getTranslatedProperty(navigationElement, "name") }}
                      <ChevronRightIcon
                        v-if="navigationElement.childCount"
                        class="h-6 w-6"
                        aria-hidden="true"
                      />
                    </RouterLink>
                    <div class="my-6 mx-4 flex flex-col gap-8">
                      <template v-for="(navigationElement, index) in currentNavigationElement.children" :key="navigationElement.id">
                        <div v-if="navigationElement.media" class="flex flex-col gap-4">
                          <img
                            :src="getSmallestThumbnailUrl(navigationElement.media)"
                            class="object-cover w-full aspect-square"
                            alt="Category image"
                          />
                          <div v-html="navigationElement.description" />
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-else-if="currentChildNavigationElement">
                    <RouterLink
                      v-for="navigationElement in currentChildNavigationElement.children"
                      :key="navigationElement.id"
                      :to="getCategoryUrl(navigationElement)"
                      class="cursor-pointer flex justify-between items-center border-b border-gray-200 px-4 block rounded-lg py-3 text-base leading-7 hover:bg-gray-50"
                      @click="close"
                    >
                      {{ getTranslatedProperty(navigationElement, "name") }}
                    </RouterLink>
                  </template>
                </div>
              </div>
            </div>
            <div class="py-2.5 fixed w-full bottom-0 left-0 flex gap-5 items-center bg-gray-50 px-6 block text-base leading-7 hover:bg-gray-50">
              <LayoutCurrency position="top-left" />
              <LayoutLanguage position="top-left" />
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
