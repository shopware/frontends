import { defineComponent, onMounted, ref } from "vue";

/**
 * @deprecated This component is deprecated and will be removed in the next major release.
 * Use Nuxt's built-in `<ClientOnly>` component instead.
 * @see https://nuxt.com/docs/api/components/client-only
 */
export const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const init = ref(false);
    onMounted(() => {
      init.value = true;
    });
    return () => (init.value && slots.default ? slots.default() : null);
  },
});
