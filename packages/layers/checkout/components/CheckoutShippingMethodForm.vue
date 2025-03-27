<script setup>
import { ref } from "vue";

const emit = defineEmits(["next"]);

const shippingMethod = ref("standard");

const handleNext = () => {
  emit("next");
};
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div class="flex items-center p-4 border border-[#cac4d0] rounded-lg">
        <div class="flex-1">
          <div class="flex items-center">
            <input
              type="radio"
              id="standard"
              v-model="shippingMethod"
              value="standard"
              class="w-4 h-4 text-[#543b95] border-[#79747e] focus:ring-[#543b95]"
            />
            <label for="standard" class="ml-2 text-[#1d1b20] font-medium">
              Standard Shipping
            </label>
          </div>
          <p class="text-sm text-[#79747e] ml-6 mt-1">
            Delivery in 3-5 business days
          </p>
        </div>
        <div class="text-[#1d1b20] font-medium">
          Free
        </div>
      </div>
      
      <div class="flex items-center p-4 border border-[#cac4d0] rounded-lg">
        <div class="flex-1">
          <div class="flex items-center">
            <input
              type="radio"
              id="express"
              v-model="shippingMethod"
              value="express"
              class="w-4 h-4 text-[#543b95] border-[#79747e] focus:ring-[#543b95]"
            />
            <label for="express" class="ml-2 text-[#1d1b20] font-medium">
              Express Shipping
            </label>
          </div>
          <p class="text-sm text-[#79747e] ml-6 mt-1">
            Delivery in 1-2 business days
          </p>
        </div>
        <div class="text-[#1d1b20] font-medium">
          $9.99
        </div>
      </div>
    </div>
    
    <div>
      <button 
        class="bg-[#543b95] hover:bg-[#3a276a] text-white px-8 py-3 rounded-md transition-colors"
        @click="handleNext"
      >
        Next
      </button>
    </div>
  </div>
</template>