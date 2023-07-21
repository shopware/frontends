<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getTranslatedProperty, getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/vue';
import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/vue/20/solid';
import { Category } from "@shopware-pwa/types";

const { navigationElements } = useNavigation();
const router = useRouter();

const test = (item: Category) => {
  if (!item?.children?.length) {
    router.push(`/${item?.seoUrls?.[0]?.seoPathInfo}`);
  }
}
</script>

<template>
  <PopoverGroup class="hidden md:flex space-x-7 items-center">
    <Popover
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
    >
      <PopoverButton
        class="flex items-center gap-1 text-sm font-medium uppercase text-current outline-none"
        v-slot="{ open }"
        @click="test(navigationElement)"
      >
        {{ getTranslatedProperty(navigationElement, "name") }}
        <template v-if="navigationElement.children?.length">
          <ChevronDownIcon v-if="!open" class="h-5 w-5 flex-none text-current" aria-hidden="true" />
          <ChevronUpIcon v-if="open" class="h-5 w-5 flex-none text-current" aria-hidden="true" />
        </template>
      </PopoverButton>

      <transition v-if="navigationElement.children?.length" enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <PopoverPanel class="absolute bottom-0 left-0 translate translate-y-full w-full z-10 overflow-hidden bg-white shadow-lg ring-1 ring-gray-900/5" v-slot="{ close }">
          <div class="container flex justify-between gap-8 py-12">
            <div class="flex gap-8">
              <div v-for="(childElement, index) in navigationElement.children" :key="childElement.id" class="group min-w-[218px] relative flex text-sm leading-6">
                <div class="flex-auto">
                  <RouterLink :to="'/' + childElement?.seoUrls?.[0]?.seoPathInfo" @click="close" class="block font-medium text-gray-900 text-sm">
                    {{ getTranslatedProperty(childElement, "name") }}
                  </RouterLink>
                  <ul
                    class="flex flex-col gap-4 mt-4"
                  >
                    <template
                      v-for="(subChildElement, ind) in childElement.children"
                      :key="subChildElement.id"
                    >
                      <RouterLink
                        v-if="
                          typeof subChildElement?.seoUrls?.[0]?.seoPathInfo !==
                            'undefined'
                        "
                        :to="'/' + subChildElement?.seoUrls?.[0]?.seoPathInfo"
                        @click="close"
                      >
                        <div
                          class="flex flex-col flex-grow"
                          :class="{
                            'max-w-200px md:max-w-300px': !!subChildElement.media,
                          }"
                        >
                          <p class="text-sm font-normal text-gray-500">
                            {{ getTranslatedProperty(subChildElement, "name") }}
                          </p>
                        </div>
                      </RouterLink>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
            <div class="flex gap-8">
              <template v-for="(childElement, index) in navigationElement.children" :key="childElement.id">
                <div v-if="childElement.media" class="flex flex-col gap-4">
                  <img
                    :src="getSmallestThumbnailUrl(childElement.media)"
                    class="object-cover w-[214px] aspect-square"
                    alt="Category image"
                  />
                  <div v-html="childElement.description" />
                </div>
              </template>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </PopoverGroup>
</template>
