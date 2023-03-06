<script setup>
const props = defineProps({
  projectPath: {
    // path to github project - including gh tree path
    type: String,
    required: true,
  },
  openPath: {
    // path to open in preview after the project is built
    type: String,
    required: false,
  },
});

const stackBlitzIframeOptions = {
  embed: 1, // embedded mode
  theme: "light", // dark
  ctl: 1, // click to load
  initialPath: props.openPath, // open at specific /path
  view: "preview", // open only a preview
  file: "README.md", // loaded file to be studied
  terminalHeight: 0, // minimize terminal size
};

const queryString = new URLSearchParams(stackBlitzIframeOptions).toString();
const exampleUrl = `https://stackblitz.com/github/${props.projectPath}?${queryString}`;
</script>
<template>
  <div
    class="stackblitz-example border-slate-400 border-dashed border-1 rounded-md p-2"
  >
    <iframe class="w-full h-500px border-none" :src="exampleUrl"></iframe>
  </div>
</template>
