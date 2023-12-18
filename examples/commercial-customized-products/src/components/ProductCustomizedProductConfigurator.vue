<script setup lang="ts">
import { computed } from "vue";
import { useProductCustomizedProductConfigurator } from "@/composables/useProductCustomizedProductConfigurator";
import { useSessionContext } from "@shopware-pwa/composables-next/dist";
const { customizedProduct, state, handleFileUpload } =
  useProductCustomizedProductConfigurator();
const { currency } = useSessionContext();

const customizedProductOptions = computed(() => {
  const options = customizedProduct.value?.options.map((option) => ({
    ...option,
    // prepend options by "No selection"
    values: [
      {
        id: undefined,
        displayName: "No selection",
        value: null,
        price: [{ gross: "0" }],
      },
      ...option.values,
    ],
  }));

  return options;
});

const removeUploadedImage = (optionId: string) => {
  delete state.value[optionId];
};
</script>
<template>
  <div class="flex flex-col">
    <h3 class="dark:text-white">
      {{ customizedProduct?.translated.displayName }}
    </h3>
    <p class="mb-3 text-gray-500 dark:text-gray-400">
      {{ customizedProduct?.translated.description }}
    </p>
    <hr />
    <div class="flex flex-col">
      <div v-for="option in customizedProductOptions" :key="option.id">
        <span class="dark:text-white">{{ option.translated.displayName }}</span>
        <div
          v-if="['select', 'colorselect', 'imageselect'].includes(option.type)"
          :id="option.id"
          :key="option.id"
          class="mb-6 mt-4"
        >
          <select
            :id="option.id"
            :key="option.id"
            v-model="state[option.id]"
            :selected="null"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option
              v-for="value in option.values"
              :key="value.id"
              :value="value.id"
              class="p-2"
              :style="{ 'background-color': value.value?._value }"
            >
              {{ value.displayName }}
              <span v-if="+(value.price?.[0] as any)?.gross > 0"
                >+{{ (value?.price?.[0] as any)?.gross }}
                {{ currency?.symbol }}</span
              >
            </option>
          </select>
        </div>

        <div v-if="option.type == 'textfield'" :id="option.id" class="mb-6">
          <input
            v-model="state[option.id]"
            type="text"
            :placeholder="option.placeholder || ''"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div v-if="option.type == 'imageupload'" :id="option.id" class="mb-6">
          <p class="mb-3 text-gray-500 dark:text-gray-400">
            {{ option.description }}
          </p>
          <div
            v-if="!state[option.id]"
            class="flex items-center justify-center w-full mt-4"
          >
            <label
              :for="`dropzone-file-${option.id}`"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-blue-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (Max. 1 file, max. 10 MB)
                </p>
              </div>
              <input
                :id="`dropzone-file-${option.id}`"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleFileUpload($event, option.id)"
              />
            </label>
          </div>
          <div v-else>
            <span class="italic dark:text-blue-400">{{
              (state[option.id] as any)?.media?.filename
            }}</span>
            <button
              type="button"
              class="ml-4 px-2 py-1 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              @click="removeUploadedImage(option.id)"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
