<script setup lang="ts">
import { ClientApiError } from "@shopware-pwa/types";
import {
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
const { category: activeCategory } = useCategory();
const { navigationElements, loadNavigationElements } = useNavigation({
  type: activeCategory.value.id as any
});
const fakeContainer = ref<any>(null);
const styling = ref({});

onMounted(async () => {
  try {
    await loadNavigationElements({ depth: 2 });
  } catch (e) {
    const err = e as ClientApiError;
    console.error("[SwBottomMenu]", err.messages);
  }
  handleSize();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
});

const resizeHandler = useDebounceFn((e: any) => {
  handleSize();
}, 500);

const handleSize = () => {
  styling.value = {
    paddingLeft: `calc(50% - ${fakeContainer.value.offsetWidth / 2}px)`,
    paddingRight: `calc(50% - ${fakeContainer.value.offsetWidth / 2}px)`,
    width: `${fakeContainer.value.offsetWidth}px`
  }
}

const slider = ref();
const isDown = ref<boolean>(false);
const startX = ref();
const scrollLeft = ref();

const handleMouseDown = (e: any) => {
  isDown.value = true;
  slider.value?.classList.add('active');
  startX.value = e.pageX - slider.value?.offsetLeft;
  scrollLeft.value = slider.value?.scrollLeft;
};
const handleMouseLeave = () => {
  isDown.value = false;
  slider.value?.classList.remove('active');
};
const handleMouseUp = () => {
  isDown.value = false;
  slider.value?.classList.remove('active');
};
const handleMouseMove = (e: any) => {
  if(!isDown.value) return;
  e.preventDefault();
  const x = e.pageX - slider.value?.offsetLeft;
  const walk = (x - startX.value) * 3; //scroll-fast
  slider.value.scrollLeft = scrollLeft.value - walk;
};

</script>
<template>
  <div>
    <div class="container">
      <h3 class="mt-8 md:mt-10 mb-2 md:mb-4 text-black md:text-gray-900">
        {{ getTranslatedProperty(activeCategory, 'name') }}
      </h3>
      <p class="text-gray-700 mb-4 max-w-[590px]" v-html="getTranslatedProperty(activeCategory, 'description')" />
    </div>
    <div class="container">
      <div ref="fakeContainer"></div>
    </div>
    <div ref="slider" @mousedown="handleMouseDown" @mouseleave="handleMouseLeave" @mouseup="handleMouseUp" @mousemove="handleMouseMove" class="container box-content flex items-center overflow-x-auto gap-2 pb-6 border-b border-b-gray-200" :style="styling">
      <nuxt-link
        v-for="subCategory of navigationElements"
        class="font-medium py-2 px-5 text-white bg-gray-800 hover:bg-brand-dark hover:cursor-pointer"
        :to="'/' + subCategory?.seoUrls?.[0]?.seoPathInfo"
      >
        {{ getTranslatedProperty(subCategory, 'name') }}
      </nuxt-link>
    </div>
  </div>
</template>
