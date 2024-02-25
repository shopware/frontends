import type { Schemas } from "#shopware";
import type { Ref } from "vue";

declare let unzer: UnzerSdkConstructor;

export interface UnzerSdk {}

export interface UnzerSdkConstructor {
  new (
    publicKey: string,
    unzerInstanceOptions: { locale: string } | null,
  ): UnzerSdk;
}

/**
 * Composable for Unzer payments
 *
 * @public
 */
export function useUnzer(): {
  isUnzerPaymentMethod: (paymentMethod: Schemas["PaymentMethod"]) => boolean;
  unzerInstance: Ref<UnzerSdk | null>;
} {
  const isUnzerPaymentMethod = (paymentMethod: Schemas["PaymentMethod"]) =>
    typeof paymentMethod?.shortName === "string" &&
    paymentMethod.shortName.includes("unzer");

  const unzerInstance = ref<UnzerSdk | null>(null);

  function createUnzerInstance() {
    if (
      unzerInstance.value === null ||
      typeof unzerInstance.value === "undefined"
    ) {
      const runtimeConfig = useRuntimeConfig();
      const publicKey = runtimeConfig.public.unzer?.publicKey;

      if (!publicKey) {
        throw new Error("[useUnzer] public key is not defined");
      }

      const { $i18n } = useNuxtApp();
      unzerInstance.value = new unzer(publicKey, {
        locale: $i18n.locale.value,
      });
    }
  }

  onBeforeMount(() => {
    useHead({
      link: [
        { rel: "stylesheet", href: "https://static.unzer.com/v1/unzer.css" },
      ],
      script: [
        {
          src: "https://static.unzer.com/v1/unzer.js",
          onload: () => {
            // Unzer script is loaded now
            createUnzerInstance();
          },
        },
      ],
    });
  });

  return {
    isUnzerPaymentMethod,
    unzerInstance,
  };
}
