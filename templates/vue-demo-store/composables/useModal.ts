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

export const useSideMenuModal = createSharedComposable(useModal);
