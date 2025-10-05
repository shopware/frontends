<script setup lang="ts">
defineProps<{
  currentLanguageLabel: string;
  languages: {
    id: string;
    label: string;
  }[];
}>();

defineSlots<{
  menu(): unknown;
}>();

const emit = defineEmits<{
  onLanguageChangeHandler: [string];
}>();

const languagesListVisibility = ref(false);
</script>
<template>
  <div class="bg-surface-surface-primary py-2">
    <div
      class="flex items-center justify-between container mx-auto color-surface-on-surface-primary"
    >
      <div class="flex items-center relative">
        <div
          @click="languagesListVisibility = !languagesListVisibility"
          class="flex items-center gap-3.5"
        >
          <Icon size="1.5rem" name="material-symbols:language" />
          <span>{{ currentLanguageLabel }}</span>
        </div>

        <ul
          v-show="languagesListVisibility"
          class="absolute bg-surface-surface-primary top-8 p-2 w-full cursor-pointer"
        >
          <li
            v-for="language in languages"
            :key="language.id"
            @click="emit('onLanguageChangeHandler', language.id)"
          >
            {{ language.label }}
          </li>
        </ul>
      </div>
      <menu>
        <slot name="menu" />
      </menu>
    </div>
  </div>
</template>
