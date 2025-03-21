<script setup>
import { ref } from "vue";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
];

const selectedLanguage = ref(languages[0]);
const isOpen = ref(false);

const selectLanguage = (language) => {
  selectedLanguage.value = language;
  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};
</script>

<template>
  <div class="relative">
    <button 
      @click="toggleDropdown" 
      class="flex items-center gap-2 outline-none  bg-transparent text-surface-on-surface-primary"
      type="button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-surface-on-surface-primary">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span class="text-surface-on-surface-primary text-[font-size-scale-02]">{{ selectedLanguage.name }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-surface-on-surface-primary">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    
    <div v-if="isOpen" 
      class="absolute z-100 mt-2 w-[160px] rounded-md bg-surface-surface shadow-lg ring-1 ring-outline-outline-variant ring-opacity-5 focus:outline-none"
      role="menu"
      @blur="closeDropdown"
    >
      <div class="py-1" role="none">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="selectLanguage(language)"
          class="flex w-full z-10 items-center gap-2 px-4 py-2 text-[font-size-scale-02] text-surface-on-surface-primary hover:bg-surface-surface-variant hover:text-brand-primary bg-surface-surface"
          role="menuitem"
        >
          <svg v-if="language.code === selectedLanguage.code" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-brand-primary">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span :class="language.code === selectedLanguage.code ? 'ml-0' : 'ml-6'">
            {{ language.name }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>