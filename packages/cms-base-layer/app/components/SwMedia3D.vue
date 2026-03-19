<script lang="ts" setup>
import { Bounds, OrbitControls, useGLTF } from "@tresjs/cientos";
import { TresCanvas } from "@tresjs/core";
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from "three";
import { computed, shallowRef } from "vue";

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

const boundsRef = shallowRef();

function focusObject() {
  boundsRef.value?.instance.lookAt(model.value);
}
</script>
<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera
      :args="[75, 1, 0.1, 2000]"
      :position="[0, 0, 500]"
    />
    <OrbitControls make-default />
    <Bounds ref="boundsRef" clip use-mounted>
      <primitive v-if="model" :object="model" @click="() => focusObject()" />
    </Bounds>
    <TresDirectionalLight :position="[3, 3, 3]" :intensity="1" />
    <TresAmbientLight :intensity="2" />
  </TresCanvas>
</template>
