<script setup>
import { ref } from "vue";

const emit = defineEmits(["next"]);

const createAccount = ref(false);
const differentBilling = ref(false);
const email = ref("");
const fullName = ref("");
const address = ref("");
const city = ref("");
const zipCode = ref("");
const phone = ref("");

const toggleCreateAccount = () => {
  createAccount.value = !createAccount.value;
};

const handleNext = () => {
  emit("next");
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <label for="email" class="block mb-2 text-[#1d1b20]">
        Email address
      </label>
      <input 
        id="email" 
        v-model="email"
        type="email"
        placeholder="Enter email address" 
        class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
      />
    </div>
    
    <button 
      @click="toggleCreateAccount"
      class="flex items-center text-[#543b95] font-medium"
    >
      <div class="w-5 h-5 mr-2 i-carbon-add"></div>
      Create customer account
    </button>
    
    <div>
      <label for="fullName" class="block mb-2 text-[#1d1b20]">
        Full name
      </label>
      <input 
        id="fullName" 
        v-model="fullName"
        type="text"
        placeholder="First and last name" 
        class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
      />
    </div>
    
    <div>
      <label for="address" class="block mb-2 text-[#1d1b20]">
        Address
      </label>
      <input 
        id="address" 
        v-model="address"
        type="text"
        placeholder="Type address for auto complete" 
        class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
      />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="city" class="block mb-2 text-[#1d1b20]">
          City
        </label>
        <input 
          id="city" 
          v-model="city"
          type="text"
          placeholder="Enter city name" 
          class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
        />
      </div>
      <div>
        <label for="zipCode" class="block mb-2 text-[#1d1b20]">
          Zip Code
        </label>
        <input 
          id="zipCode" 
          v-model="zipCode"
          type="text"
          placeholder="Enter ZIP code" 
          class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
        />
      </div>
    </div>
    
    <div>
      <label for="phone" class="block mb-2 text-[#1d1b20]">
        Phone number
      </label>
      <input 
        id="phone" 
        v-model="phone"
        type="tel"
        placeholder="Enter mobile phone number" 
        class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
      />
      <p class="text-sm text-[#79747e] mt-1">
        Will only be used for information about your order
      </p>
    </div>
    
    <div class="flex items-center space-x-2">
      <input 
        id="differentBilling" 
        v-model="differentBilling"
        type="checkbox"
        class="w-4 h-4 border-[#79747e] text-[#543b95] focus:ring-[#543b95] rounded"
      />
      <label
        for="differentBilling"
        class="text-[#1d1b20] font-medium cursor-pointer"
      >
        Different billing address
      </label>
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