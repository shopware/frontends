/**
 * Use it to create simple modal controllers
 */
export function useModal() {
  const isOpen = ref(false);

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen: computed(() => isOpen.value),
    open,
    close,
  };
}

/**
 * Shared instance of a specific modal, use it if you want to have control over modal state over multiple components.
 * You can create more shared instances for your needs.
 */
export const useTeamModal = createSharedComposable(useModal);
