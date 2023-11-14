import type { ShopwareError } from "@shopware-pwa/types";

type ContextErrors = {
  [key: string]: {
    [key: string]: string;
  };
};

/**
 *  List of the unsupported/broken backend errors
 */
const contextErrors: ContextErrors = {
  account_login: {
    "0": "login_no_matching_customer_internal",
  },
};

export function useApiErrorsResolver(
  errors: ShopwareError[],
  context?: string,
) {
  const { $i18n } = useNuxtApp();
  const { t, te } = $i18n;

  const errorsTable = errors.map(({ detail, code, meta }) => {
    if (te(`errors.${code}`)) {
      return t(`errors.${code}`, { ...meta?.parameters });
    }
    if (context && contextErrors[context][code]) {
      return t(`errors.${contextErrors[context][code]}`);
    }

    return detail;
  });

  return {
    errors: errorsTable,
  };
}
