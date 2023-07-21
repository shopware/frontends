<script setup lang="ts">
const props = defineProps<{
  controller: ReturnType<typeof useModal>;
}>();

const { isOpen, close } = props.controller;
</script>

<template>
  <Teleport to="body">
    <transition
      enterActiveClass="transition ease-out duration-200 transform"
      enterFromClass="opacity-0"
      enterToClass="opacity-100"
      leaveActiveClass="transition ease-in duration-200 transform"
      leaveFromClass="opacity-100"
      leaveToClass="opacity-0"
    >
      <div
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
        v-show="isOpen"
        @click="close"
      >
        <div
          class="flex items-start justify-center min-h-screen pt-24 text-center"
        >
          <transition
            enterActiveClass="transition ease-out duration-300 transform "
            enterFromClass="opacity-0 translate-y-10 scale-95"
            enterToClass="opacity-100 translate-y-0 scale-100"
            leaveActiveClass="ease-in duration-200"
            leaveFromClass="opacity-100 translate-y-0 scale-100"
            leaveToClass="opacity-0 translate-y-10 translate-y-0 scale-95"
          >
            <div
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl p-8 w-1/2"
              role="dialog"
              ref="modal"
              aria-modal="true"
              aria-labelledby="modal-headline"
              v-if="isOpen"
            >
              <slot></slot>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
