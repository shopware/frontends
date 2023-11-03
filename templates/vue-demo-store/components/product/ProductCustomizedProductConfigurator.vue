<script setup lang="ts">
import type { Product } from "@shopware-pwa/types";
import { useProductCustomizedProductConfigurator } from "@shopware-pwa/composables-next";
const { customizedProduct, state, addToCart } = useProductCustomizedProductConfigurator();
const { currency } = useSessionContext();
const { apiInstance } = useShopwareContext();

const customizedProductOptions = computed(() => {
  const options = customizedProduct.value.options.map((option) => ({
    ...option,
    values: [{id: undefined, displayName: "No selection", value: null, price: [{gross: "0"}]}, ...option.values],
  }));

  return options;

})

const emit = defineEmits<{
  (e: "change", selected: Product): void;
}>();

const handleFileUpload = async (event: Event, optionId: string) => {
   const file = (event.target as EventTarget & { files: FileList }).files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("optionId", optionId);
  const headers = { "Content-Type": "multipart/form-data" };
  const addedMediaResponse = await apiInstance.invoke.post<{mediaId: string; fileName: string}>(
    `/store-api/customized-products/upload`,
    formData,
    {
      headers,
    },
  );

  state.value[optionId] = {
    media: {
      id: addedMediaResponse?.data?.mediaId,
      filename: addedMediaResponse?.data?.fileName
    }
  }
}

const removeUploadedImage = (optionId: string) => {
delete state.value[optionId];

}

</script>

<template>
  
  <div class="flex flex-col">

   
    <h3>{{ customizedProduct.translated.displayName }}</h3>
    <p class="mb-3 text-gray-500 dark:text-gray-400">
      {{ customizedProduct.translated.description }}
    </p>
    <hr />
    <div class="flex flex-col">
      <p v-for="option in customizedProductOptions">
      {{ option.translated.displayName }}
        <div class="mb-6 mt-4" v-if="['select', 'colorselect', 'imageselect'].includes(option.type)" :id="option.id">
          <select
            :id="option.id"
            :selected="null"
            v-model="state[option.id]"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option
              :value="value.id"
              class="p-2"
              v-for="value in option.values"
             :style="{'background-color': value.value?._value}"
            >
              {{ value.displayName }} <span v-if="+value.price?.[0]?.gross > 0">+{{ value?.price?.[0]?.gross }} {{ currency?.symbol }}</span>
            </option>
          </select>
        </div>
        
        <div class="mb-6" v-if="option.type=='textfield'" :id="option.id">
          <input type="text" v-model="state[option.id]" :placeholder="option.placeholder || ''" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div class="mb-6" v-if="option.type=='imageupload'" :id="option.id">
          <p class="mb-3 text-gray-500 dark:text-gray-400">{{ option.description }}</p>
         <div class="flex items-center justify-center w-full mt-4" v-if="!state[option.id]">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (Max. 1 file(s), max. 10 MB per file)</p>
                </div>
                <input id="dropzone-file" @change="handleFileUpload($event, option.id)" type="file" class="hidden" />
            </label>
        </div> 
        <div v-else>
          <span class="italic">{{ state[option.id]?.media?.filename }}</span> 
          
          <button type="button" @click="removeUploadedImage(option.id)" class="ml-4 px-2 py-1 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">x</button>

        </div>

        </div>
      </p>
    </div>
      <button @click="addToCart" class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
        <span class="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          add custom product to cart
        </span>
      </button>
  </div>
</template>
