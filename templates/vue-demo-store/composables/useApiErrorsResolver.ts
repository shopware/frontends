import type { ShopwareError } from "@shopware-pwa/types";

export function useApiErrorsResolver(errors: ShopwareError[]) {
  const { $i18n } = useNuxtApp();
  const { t, te } = $i18n;

  const errorsTable = errors.map(({ detail, code, meta }) => {
    if (te(`errors.${code}`)) {
      return t(`errors.${code}`, { ...meta?.parameters });
    }
    if (code === "0") {
      // Add
    }

    return detail;
  });

  return {
    errors: errorsTable,
  };
}
