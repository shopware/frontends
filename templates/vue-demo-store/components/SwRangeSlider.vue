<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    change: (payload: { min: number, max: number, type: string }) => void;
    min: number;
    max: number;
  }>(),
  {
    change: () => {},
  }
);
const emit = defineEmits(['change']);

const { currentCurrency } = useCurrency();

const minError = ref<any>();
const maxError = ref<any>();
const minValue = ref(props.min);
const maxValue = ref(props.max);
const minTempValue = ref(props.min);
const maxTempValue = ref(props.max);
const pos1 = ref();
const pos3 = ref();
const leftMarker = ref();
const rightMarker = ref();
const rightMarkerPos = ref(0);
const leftMarkerPos = ref(0);
const currentMarkerType = ref('left');
const rangeBar = ref();
const trackBar = ref();
const dragMarker = (type: 'left' | 'right', e: any) => {
  e = e || window.event;
  e.preventDefault();
  currentMarkerType.value = type;
  // get the mouse cursor position at startup:
  pos3.value = e.clientX;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
}

const elementDrag = (e: any) => {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1.value = pos3.value - e.clientX;
    pos3.value = e.clientX;
    let markerElement;
    let percent;
    if (currentMarkerType.value === 'left') {
      markerElement = leftMarker.value;
    } else if (currentMarkerType.value === 'right') {
      markerElement = rightMarker.value;
    }
    // set the element's new position:
    const tempPercent = (markerElement.offsetLeft - pos1.value) / trackBar.value.offsetWidth * 100;
    if (currentMarkerType.value === 'left') {
      if (tempPercent < 0) {
        percent = 0;
      } else if (tempPercent > rightMarkerPos.value) {
        percent = rightMarkerPos.value;
      } else {
        percent = tempPercent;
      }
      moveMarker(percent, 'left');
    } else if (currentMarkerType.value === 'right') {
      if (tempPercent < leftMarkerPos.value) {
        percent = leftMarkerPos.value;
      } else if (tempPercent > 100) {
        percent = 100;
      } else {
        percent = tempPercent;
      }
      moveMarker(percent, 'right');
    }
   
  }

const closeDragElement = () => {
  /* stop moving when mouse button is released:*/
  document.onmouseup = null;
  document.onmousemove = null;
}

const handleClickTrackBar = (e: any) => {
  const tempPercent = e.offsetX / trackBar.value.offsetWidth * 100;
  if (tempPercent < leftMarkerPos.value) {
    currentMarkerType.value = 'left';
    moveMarker(tempPercent, 'left');
  } else if (tempPercent > rightMarkerPos.value) {
    currentMarkerType.value = 'right';
    moveMarker(tempPercent, 'right');
  } else {
    if (tempPercent < ((rightMarkerPos.value + leftMarkerPos.value) / 2)) {
      moveMarker(tempPercent, 'left');
    } else {
      moveMarker(tempPercent, 'right');
    }
  }
}

const moveMarker = (percent: number, type: string) => {
  if (type === 'left') {
    leftMarkerPos.value = percent;
  } else if (type === 'right') {
    rightMarkerPos.value = percent;
  }
}

const convertPercentage = (percent: number) => {
  return `${percent ?? 0}%`
}

const calcValue = (percent: number) => {
  return parseFloat((props.min + ((props.max - props.min) * percent / 100)).toFixed(2));
}

const calcPercent = (value: number) => {
  return ((value - props.min) / (props.max - props.min)) * 100;
}

const handleInputMin = (e: any) => {
  minTempValue.value = +e.target.value;
  if (+e.target.value <= maxValue.value && +e.target.value >= props.min) {
    minValue.value = +e.target.value;
    minError.value = false;
    leftMarkerPos.value = calcPercent(minValue.value);
  } else {
    minError.value = true;
  }
}

const handleInputMax = (e: any) => {
  maxTempValue.value = +e.target.value;
  if (+e.target.value >= minValue.value && +e.target.value <= props.max) {
    maxValue.value = +e.target.value;
    maxError.value = false;
    rightMarkerPos.value = calcPercent(maxValue.value);
  } else {
    maxError.value = true;
  }
}


const handleChange = (type: string) => {
  emit('change', { type, min: minValue.value, max: maxValue.value });
}
const emitChange = useDebounceFn(handleChange, 500);

onMounted(() => {
  if (props.min) {
    leftMarkerPos.value = 0;
  }
  if (props.max) {
    rightMarkerPos.value = 100;
  }
});

watch([leftMarkerPos, rightMarkerPos], ([leftPos, rightPos], [prevLeftPos, prevRightPos]) => {
  if (leftPos !== prevLeftPos) {
    leftMarker.value.style.left = convertPercentage(leftPos);
    minValue.value = calcValue(leftPos);
    minTempValue.value = minValue.value;
    emitChange('start');
  }
  if (rightPos !== prevRightPos) {
    rightMarker.value.style.left = convertPercentage(rightPos);
    maxValue.value = calcValue(rightPos);
    maxTempValue.value = maxValue.value;
    emitChange('end');
  }
  rangeBar.value.style.left = convertPercentage(leftPos);
  rangeBar.value.style.right = convertPercentage(100 - rightPos);
});
</script>

<template>
  <div class="mb-6 w-full flex justify-between">
    <div class="px-2 shadow-chip border h-8 flex justify-center items-center text-sm" :class="[
      minError ? 'border-red text-red' : 'border-gray-300 text-gray-900'
    ]">
      <span class="relative">
        <span class="opacity-0">{{ minTempValue }}</span>
        <input type="number" class="outline-none absolute top-0 left-0 w-full h-full bg-transparent" :value="minTempValue" @input="handleInputMin" />
      </span>
      <span class="pl-1">{{currentCurrency?.symbol ?? ''}}</span>
    </div>
    <div class="px-2 shadow-chip border h-8 flex justify-center items-center text-sm" :class="[
      maxError ? 'border-red text-red' : 'border-gray-300 text-gray-900'
    ]">
      <span class="relative">
        <span class="opacity-0">{{ maxTempValue }}</span>
        <input type="number" class="outline-none absolute top-0 left-0 w-full h-full bg-transparent" :value="maxTempValue" @input="handleInputMax" />
      </span>
      <span class="pl-1">{{currentCurrency?.symbol ?? ''}}</span>
    </div>
  </div>
  <div class="range-slider-contaniner">
    <div ref="trackBar" class="track-bar" @click="handleClickTrackBar">
      <div class="track-bar-content"></div>
    </div>
    <div ref="rangeBar" class="range-bar"></div>
    <div ref="leftMarker" class="marker" @mousedown="(e) => dragMarker('left', e)"></div>
    <div ref="rightMarker" class="marker" @mousedown="(e) => dragMarker('right', e)"></div>
  </div>
</template>

<style scoped>
.range-slider-contaniner {
  @apply relative mx-2 h-2;
}
.track-bar {
  @apply box-content absolute top-0 translate -translate-y-1/2 w-full h-1 py-1.5;
}
.track-bar-content {
  @apply w-full h-full rounded-lg bg-gray-200 cursor-pointer;
}
.range-bar {
  @apply absolute top-0 translate -translate-y-1/2 h-1 rounded-lg bg-gray-700 pointer-events-none cursor-pointer;
}
.marker {
  @apply absolute top-0 translate -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-700 cursor-pointer;
}
</style>