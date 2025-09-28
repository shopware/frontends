<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers";

const { currentMenuPosition } = defineProps<{
  currentMenuPosition: string | undefined;
}>();

const { navigationElements } = useNavigation();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const subcategories = computed(() => {
  return (
    navigationElements.value?.find(
      (element) => element.id === currentMenuPosition,
    )?.children ?? []
  );
});
</script>
<template>
  <div v-if="subcategories.length" class="flex flex-wrap py-6 items-start">
    <div
      class="w-1/3 mb-8"
      v-for="subcategory in subcategories"
      :key="subcategory.id"
    >
      <NuxtLink
        class="mb-3 block"
        role="menuitem"
        :target="
          subcategory.externalLink || subcategory.linkNewTab ? '_blank' : ''
        "
        :to="formatLink(getCategoryRoute(subcategory))"
      >
        <div class="text-brand-primary font-bold flex items-center gap-1">
          {{ subcategory.name }}
          <Icon
            v-if="subcategory.children.length"
            name="shopware:chevron-right-xxs"
            class="w-1.5"
          />
        </div>
      </NuxtLink>

      <ul v-if="subcategory.children.length" class="gap-3 flex flex-col">
        <li v-for="child in subcategory.children" :key="child.id">
          <NuxtLink
            role="menuitem"
            :target="child.externalLink || child.linkNewTab ? '_blank' : ''"
            :to="formatLink(getCategoryRoute(child))"
          >
            <div class="">
              {{ child.name }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
