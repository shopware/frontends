import { ref, onMounted, defineComponent } from "vue";

export const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const init = ref(false);
    onMounted(() => {
      init.value = true;
    });
    return () => (init.value && slots.default ? slots.default() : null);
  },
});
