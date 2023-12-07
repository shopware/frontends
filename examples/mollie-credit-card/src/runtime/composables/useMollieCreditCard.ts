import { useNuxtApp, ref } from "#imports";
import { MollieElement } from "../../types";

/**
 * Composable function to mount and unmount Credit Card component
 */
export function useMollieCreditCard({ elementId }: { elementId: string }) {
  const { $mollie } = useNuxtApp();
  const mollieComponent = ref<MollieElement>();
  async function mount() {
    try {
      mollieComponent.value =
        await $mollie.mollieInstance?.createComponent("card");
      await mollieComponent.value?.mount(`#${elementId}`);
    } catch (error) {
      console.error(
        `[useMollieCreditCard][onMounted > createComponent]: ${error}`,
      );
      throw error;
    }
  }

  function unmount() {
    mollieComponent.value?.unmount();
  }

  return {
    mount,
    unmount,
  };
}
