<script setup>
import { ref } from "vue";

const cardNumber = ref("");
const expiryDate = ref("");
const cvv = ref("");
const nameOnCard = ref("");

const placeOrder = () => {
  // Handle order placement logic
  console.log("Order placed");
};
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div>
        <label for="cardNumber" class="block mb-2 text-[#1d1b20]">
          Card number
        </label>
        <input 
          id="cardNumber" 
          v-model="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456" 
          class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="expiryDate" class="block mb-2 text-[#1d1b20]">
            Expiry date
          </label>
          <input 
            id="expiryDate" 
            v-model="expiryDate"
            type="text"
            placeholder="MM/YY" 
            class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
          />
        </div>
        <div>
          <label for="cvv" class="block mb-2 text-[#1d1b20]">
            CVV
          </label>
          <input 
            id="cvv" 
            v-model="cvv"
            type="text"
            placeholder="123" 
            class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
          />
        </div>
      </div>
      
      <div>
        <label for="nameOnCard" class="block mb-2 text-[#1d1b20]">
          Name on card
        </label>
        <input 
          id="nameOnCard" 
          v-model="nameOnCard"
          type="text"
          placeholder="Enter name as it appears on card" 
          class="w-full border border-[#cac4d0] rounded-lg p-4 text-[#1d1b20]" 
        />
      </div>
    </div>
    
    <div>
      <button 
        class="bg-[#543b95] hover:bg-[#3a276a] text-white px-8 py-3 rounded-md transition-colors"
        @click="placeOrder"
      >
        Confirm and place order
      </button>
    </div>
  </div>
</template>