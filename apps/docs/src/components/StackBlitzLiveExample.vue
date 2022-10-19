<script setup>
import { defineProps } from "vue";
const props = defineProps({
  projectId: {
    // project id - stackblitz specific
    type: String,
    required: true,
  },
  example: {
    // file located in src/examples of the sample project - https://github.com/mkucmus/frontends-examples
    type: String,
    required: false,
  },
});

const stackBlitzIframeOptions = {
  embed: 1, // embedded mode
  theme: "light", // dark
  ctl: 1, // click to load
  initialPath: props.example, // open at specific /path
  view: "preview", // open only a preview
  file: `src/examples/${props.example}.vue`, // loaded file to be studied
  terminalHeight: 0, // minimize terminal size
};

const queryString = new URLSearchParams(stackBlitzIframeOptions).toString();
const exampleUrl = `https://stackblitz.com/github/${props.projectId}?${queryString}`;
</script>
<template>
  <div
    class="stackblitz-example border-slate-400 border-dashed border-1 rounded-md p-2"
  >
    <iframe class="w-full h-500px border-none" :src="exampleUrl"></iframe>
  </div>
</template>
