<script setup>
import { ref } from "vue";
import { useAi } from "../composables/useAi";

const props = defineProps({
  answer: Object,
  query: String,
});

const { sendFeedback, buildHighlight, buildDocLink } = useAi();

const feedbackChosen = ref(false);

const sendFeedbackHandler = async (
  isCorrectAnswer,
  isCorrectDocument,
  document,
) => {
  try {
    await sendFeedback(
      props.query,
      isCorrectAnswer,
      isCorrectDocument,
      document,
    );
    feedbackChosen.value = true;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div v-html="buildHighlight(props.answer)" />
  <div class="mt-4 sm:flex gap-3">
    <div v-if="props.answer.score">
      <span class="font-bold">Relevance:</span>
      {{ (props.answer.score * 100).toFixed(3) }}
    </div>
    <div v-if="props.answer.meta.name">
      <span class="font-bold">Source: </span>
      <a :href="`/${buildDocLink(props.answer.meta.name)}`">{{
        buildDocLink(props.answer.meta.name)
      }}</a>
    </div>
  </div>
  <div v-if="!feedbackChosen" class="flex mt-3 gap-3">
    <div
      class="border-1 p-2 cursor-pointer"
      @click="sendFeedbackHandler(true, true, props.answer)"
    >
      <div class="w-6 h-6 i-carbon-thumbs-up" />
    </div>
    <div
      class="border-1 p-2 cursor-pointer"
      @click="sendFeedbackHandler(false, true, props.answer)"
    >
      <div class="w-6 h-6 i-carbon-thumbs-down" />
    </div>
    <div
      class="border-1 p-2 cursor-pointer"
      @click="sendFeedbackHandler(true, false, props.answer)"
    >
      <div class="w-6 h-6 i-carbon-subtract-alt" />
    </div>
  </div>
  <div v-else class="p2 mt-3 border-1 border-green text-green">
    Your feedback has been sent!
  </div>
</template>
