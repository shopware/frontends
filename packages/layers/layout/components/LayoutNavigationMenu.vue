<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";
import { ChevronRight } from "lucide-vue-next";
import { computed, reactive, ref } from "vue";

// Define props with NavigationRouteResponse type
const props = defineProps<{
  navigationElements: Array<Schemas["NavigationRouteResponse"]>;
}>();

// Convert navigation elements to menu structure
const menuItems = computed(() => {
  return props.navigationElements.map((item) => item.name || "");
});

// Prepare mega menu data from navigation elements
const megaMenuData = computed(() => {
  const result: Record<string, { category: string; items: string[] }[]> = {};

  props.navigationElements.forEach((navElement) => {
    if (!navElement.name) return;

    // Create an entry for each top-level navigation item
    result[navElement.name] = [];

    // Group children by their first level
    const groupedChildren: Record<string, string[]> = {};

    navElement.children?.forEach((child) => {
      // Use child's name as category
      const categoryName = child.name || "Category";

      if (!groupedChildren[categoryName]) {
        groupedChildren[categoryName] = [];
      }

      // Add grandchildren as items
      child.children?.forEach((grandChild) => {
        if (grandChild.name) {
          groupedChildren[categoryName].push(grandChild.name);
        }
      });

      // If no grandchildren, add the child itself as an item
      if (!child.children?.length && child.name) {
        groupedChildren[categoryName].push(child.name);
      }
    });

    // Convert grouped children to the required format
    Object.entries(groupedChildren).forEach(([category, items]) => {
      result[navElement.name].push({
        category,
        items,
      });
    });

    // If no children, create a default category
    if (!navElement.children?.length) {
      result[navElement.name].push({
        category: "Category",
        items: ["No items available"],
      });
    }
  });

  return result;
});

const activeMenu = ref<string | null>(null);
const focusedItems = reactive<Record<string, boolean>>({});

const handleMouseEnter = (menuItem: string) => {
  activeMenu.value = menuItem;
};

const handleMouseLeave = () => {
  activeMenu.value = null;
};

const handleFocus = (id: string) => {
  focusedItems[id] = true;
};

const handleBlur = (id: string) => {
  focusedItems[id] = false;
};
</script>
<template>
  <div class="relative bg-surface-surface" @mouseleave="handleMouseLeave">
    <nav class="w-full border-b border-outline-outline-variant">
      <div class="max-w-7xl mx-auto p-6 sm:pr-6 lg:pr-8">
        <div class="flex justify-center sm:justify-start">
          <div class="flex space-x-8">
            <div v-for="(item, index) in menuItems" :key="index" class="relative" @mouseenter="handleMouseEnter(item)">
              <a 
                :href="props.navigationElements[index]?.route?.path || '#'" 
                :id="`main-menu-${index}`" 
                @focus="handleFocus(`main-menu-${index}`)"
                @blur="handleBlur(`main-menu-${index}`)" 
                :class="[
                  'justify-start text-base font-normal leading-normal',
                  item.toLowerCase().includes('sale') ? 'text-other-sale' : 'text-surface-on-surface',
                  'hover:underline',
                  'active:underline active:font-bold',
                  activeMenu === item ? 'underline' : '',
                  focusedItems[`main-menu-${index}`] ? 'outline outline-2 outline-outline-outline-focus rounded-md' : 'outline-none'
                ]"
              >
                {{ item }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mega Menu Dropdown -->
    <div 
      v-if="activeMenu && megaMenuData[activeMenu]"
      class="absolute left-0 w-full bg-surface-surface shadow-lg z-50 border-t border-outline-outline-variant border-t-0"
      @mouseenter="activeMenu = activeMenu"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pl-0">
        <h2 class="text-font-size-scale-04 font-medium text-surface-on-surface mb-6">{{ activeMenu }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(column, columnIndex) in megaMenuData[activeMenu]" 
            :key="columnIndex"
            class="flex flex-col space-y-4"
          >
            <!-- Category header -->
            <a 
              :href="'#'" 
              :id="`category-${columnIndex}`" 
              @focus="handleFocus(`category-${columnIndex}`)"
              @blur="handleBlur(`category-${columnIndex}`)" 
              :class="[
                'text-brand-primary font-medium flex items-center',
                'hover:underline',
                'active:underline',
                focusedItems[`category-${columnIndex}`] ? 'outline outline-2 outline-outline-outline-focus rounded-md' : 'outline-none'
              ]"
            >
              {{ column.category }}
              <ChevronRight class="ml-1 h-4 w-4" />
            </a>

            <div class="flex flex-col space-y-3">
              <a 
                v-for="(item, itemIndex) in column.items" 
                :key="itemIndex" 
                href="#"
                :id="`submenu-${columnIndex}-${itemIndex}`" 
                @focus="handleFocus(`submenu-${columnIndex}-${itemIndex}`)"
                @blur="handleBlur(`submenu-${columnIndex}-${itemIndex}`)" 
                :class="[
                  'text-font-size-scale-02',
                  item.toLowerCase().includes('sale') ? 'text-other-sale' : 'text-surface-on-surface',
                  'hover:underline',
                  'active:underline',
                  focusedItems[`submenu-${columnIndex}-${itemIndex}`] ? 'outline outline-2 outline-outline-outline-focus rounded-md' : 'outline-none'
                ]"
              >
                {{ item }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>