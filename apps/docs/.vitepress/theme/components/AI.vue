<script setup>
import { ref, reactive } from "vue";
import { useAi } from "../composables/useAi";
import AIAnswer from "./AIAnswer.vue";

const { sendQueryRequest, prepareData } = useAi();

const inputValue = ref("");
const loading = ref(false);
const answer = reactive({
  q: "",
  a: "",
});

const sendRequestHandler = async () => {
  loading.value = true;
  const response = await sendQueryRequest(inputValue.value);
  loading.value = false;
  answer.q = inputValue.value;
  answer.a = prepareData(response.answers) ?? "";
};
</script>
<template>
  <form @submit.prevent="sendRequestHandler()">
    <div class="flex gap-2">
      <input
        class="border-1 p-2 w-full"
        type="text"
        v-model="inputValue"
        :disabled="loading"
        placeholder="Type question here..."
      />
      <button class="border-1 p-2 min-w-30" type="submit" :disabled="loading">
        Send
      </button>
    </div>
  </form>

  <section class="mt-10">
    <div class="flex justify-center" v-if="loading">
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div v-if="!loading && answer.q">
      <div class="font-bold text-6">Results:</div>
      <div v-if="answer.a.length" class="divide-y">
        <div v-for="a in answer.a" :key="a.id" class="mb-5 pt-4">
          <AIAnswer :answer="a" :query="inputValue" />
        </div>
      </div>
      <div v-else>No result :(</div>
    </div>
  </section>
</template>
