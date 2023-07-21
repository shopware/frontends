<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const { navigationElements } = useNavigation({ type: "footer-navigation" });
const gridColumns = computed<number>(() =>
  navigationElements.value
    ? Object.keys(navigationElements.value).length + 2
    : 2
);
</script>

<template>
  <footer class="py-12 md:py-16 w-full bg-brand-primary" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="container mx-auto flex flex-col justify-center">
      <div
        class="lg:px-28 w-full grid grid-cols-2 md:grid-cols-4"
      >
        <div
          v-for="navigationElement in navigationElements"
          :key="navigationElement.id"
        >
          <h4 class="mb-4 text-gray-400 uppercase font-semibold text-sm">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </h4>
          <template v-if="navigationElement.childCount > 0">
            <ul role="list" class="list-none p-0 mb-4 md:mb-14">
              <li
                v-for="navigationChild in navigationElement.children"
                :key="navigationChild.id"
                class="pb-4"
              >
                <RouterLink
                  :to="'/' + navigationChild.seoUrls?.[0]?.seoPathInfo"
                  class="text-base font-normal text-gray-300"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </RouterLink>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <div
        class="lg:px-28 w-full grid grid-cols-1 gap-8 md:gap-0 md:grid-cols-2"
      >
        <div>
          <h4 class="mb-4 text-gray-400 uppercase font-semibold text-sm">
            {{$t('social')}}
          </h4>
          <div class="flex space-x-6">
            <div class="cursor-pointer text-gray-400 hover:text-gray-300 w-6 h-6 i-custom:facebook" />
            <div class="cursor-pointer text-gray-400 hover:text-gray-300 w-6 h-6 i-carbon-logo-instagram" />
            <div class="cursor-pointer text-gray-400 hover:text-gray-300 w-6 h-6 i-carbon-logo-twitter" />
            <div class="cursor-pointer text-gray-400 hover:text-gray-300 w-6 h-6 i-carbon-logo-youtube" />
          </div>
        </div>
        <div>
          <h4 class="mb-4 text-gray-400 uppercase font-semibold text-sm">
            {{$t('payment')}}
          </h4>
          <div class="flex space-x-6">
            <img
              alt="klarna icon"
              width="44"
              height="24"
              src="/assets/svg/klarna.svg"
              loading="lazy"
            />
            <img
              alt="visa icon"
              width="50"
              height="24"
              src="/assets/svg/visa.svg"
              loading="lazy"
            />
            <img
              alt="mastercard icon"
              width="32"
              height="24"
              src="/assets/svg/mastercard.svg"
              loading="lazy"
            />
            <img
              alt="swish icon"
              width="62.5714"
              height="24"
              src="/assets/svg/swish.svg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div class="border-t border-gray-600 my-8"></div>
      <p class="text-gray-400 text-sm text-center">{{ $t('copyright') }}</p>
    </div>
  </footer>
</template>
