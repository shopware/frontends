<script lang="ts" setup>
import { OrbitControls, useGLTF } from "@tresjs/cientos";
import { TresCanvas } from "@tresjs/core";
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from "three";
import { computed } from "vue";

const props = defineProps<{
  src: string;
}>();

const gl = {
  clearColor: "#FFF",
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
  windowSize: false,
};

const { state } = await useGLTF(props.src);
const model = computed(() => state.value?.scene);
</script>
<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera
      :args="[75, 1, 0.1, 2000]"
      :position="[0, 0, 500]"
      :look-at="[0, 0, 0]"
    />
    <OrbitControls />
    <primitive :object="model" />
    <TresDirectionalLight :position="[3, 3, 3]" :intensity="1" />
    <TresAmbientLight :intensity="2" />
  </TresCanvas>
</template>
