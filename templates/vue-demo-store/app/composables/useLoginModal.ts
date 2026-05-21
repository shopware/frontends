import type { ComputedRef } from "vue";

export interface LoginModalContext {
  open: (options?: { onSuccess?: () => void | Promise<void> }) => void;
  close: () => void;
  isOpen: ComputedRef<boolean>;
}

export const LOGIN_MODAL_KEY = "loginModal";

/**
 * Provides a login modal context via provide/inject.
 * Call once in app.vue to make the login modal available to all descendant components.
 */
export function provideLoginModal() {
  const isOpen = ref(false);
  const onSuccessCallback = ref<(() => void | Promise<void>) | null>(null);

  const open = (options?: { onSuccess?: () => void | Promise<void> }) => {
    onSuccessCallback.value = options?.onSuccess ?? null;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    onSuccessCallback.value = null;
  };

  const handleSuccess = () => {
    const callback = onSuccessCallback.value;
    onSuccessCallback.value = null;
    callback?.();
  };

  const route = useRoute();
  watch(
    () => route.path,
    () => {
      close();
    },
  );

  const context: LoginModalContext = {
    open,
    close,
    isOpen: computed(() => isOpen.value),
  };

  provide(LOGIN_MODAL_KEY, context);

  return {
    controller: context,
    handleSuccess,
  };
}

/**
 * Injects the login modal context provided by provideLoginModal().
 * Returns null if no provider exists (backward-compatible fallback).
 */
export function useLoginModal(): LoginModalContext | null {
  return inject(LOGIN_MODAL_KEY, null);
}
