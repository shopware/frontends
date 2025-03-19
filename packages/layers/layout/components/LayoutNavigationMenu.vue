<template>
  <div class="relative" @mouseleave="handleMouseLeave">
    <nav class="w-full border-b border-[#cac4d0]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center sm:justify-start">
          <div class="flex space-x-8">
            <div
              v-for="(item, index) in menuItems"
              :key="index"
              class="relative"
              @mouseenter="handleMouseEnter(item)"
            >
              <a
                href="#"
                :id="`main-menu-${index}`"
                @focus="handleFocus(`main-menu-${index}`)"
                @blur="handleBlur(`main-menu-${index}`)"
                :class="[
                  'inline-flex items-center px-1 pt-1 pb-2 text-sm font-medium',
                  item === 'Sale' ? 'text-[#d12d24]' : 'text-[#1d1b20]',
                  'hover:underline',
                  'active:underline',
                  activeMenu === item ? 'underline' : '',
                  focusedItems[`main-menu-${index}`] ? 'outline outline-2 outline-[#1722f9] rounded-md' : 'outline-none'
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
      class="absolute left-0 w-full bg-white shadow-lg z-50 border-t border-[#cac4d0]"
      @mouseenter="activeMenu = activeMenu"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-lg font-medium text-[#1d1b20] mb-6">Dropdown Menu</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(column, columnIndex) in megaMenuData[activeMenu]"
            :key="columnIndex"
            class="flex flex-col space-y-4"
          >
            <!-- Category header -->
            <a
              href="#"
              :id="`category-${columnIndex}`"
              @focus="handleFocus(`category-${columnIndex}`)"
              @blur="handleBlur(`category-${columnIndex}`)"
              :class="[
                'text-[#543b95] font-medium flex items-center',
                'hover:underline',
                'active:underline',
                focusedItems[`category-${columnIndex}`] ? 'outline outline-2 outline-[#1722f9] rounded-md' : 'outline-none'
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
                  'text-sm',
                  item.includes('sale') ? 'text-[#d12d24]' : 'text-[#1d1b20]',
                  'hover:underline',
                  'active:underline',
                  focusedItems[`submenu-${columnIndex}-${itemIndex}`] ? 'outline outline-2 outline-[#1722f9] rounded-md' : 'outline-none'
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

<script setup>
import { ChevronRight } from "lucide-vue-next";
import { reactive, ref } from "vue";

// Sample data structure for the megamenu
const megaMenuData = {
  "Seasonal Item": [
    {
      category: "Category",
      items: [
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Subcategory on sale",
      ],
    },
    {
      category: "Category",
      items: [
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Subcategory on sale",
      ],
    },
  ],
  "Menu Item 1": [
    {
      category: "Category",
      items: ["Menu item", "Menu item", "Menu item", "Subcategory on sale"],
    },
    {
      category: "Category",
      items: [
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Subcategory on sale",
      ],
    },
    {
      category: "Category",
      items: [
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Subcategory on sale",
      ],
    },
  ],
  "Menu Item 2": [
    {
      category: "Category",
      items: [
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Subcategory on sale",
      ],
    },
    {
      category: "Category",
      items: [
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Menu item",
        "Subcategory on sale",
      ],
    },
  ],
};

const menuItems = [
  "Seasonal Item",
  "Menu Item 1",
  "Menu Item 2",
  "Menu Item 3",
  "Menu Item 4",
  "Menu Item 5",
  "Menu Item 6",
  "Sale",
];

const activeMenu = ref(null);
const focusedItems = reactive({});

const handleMouseEnter = (menuItem) => {
  activeMenu.value = menuItem;
};

const handleMouseLeave = () => {
  activeMenu.value = null;
};

const handleFocus = (id) => {
  focusedItems[id] = true;
};

const handleBlur = (id) => {
  focusedItems[id] = false;
};
</script>
