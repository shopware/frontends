import type { ApiError } from "@shopware/api-client";

type ContextErrors = {
  [key: string]: {
    [key: string]: string;
  };
};

export type UseApiErrorsResolver = {
  resolveApiErrors(errors: ApiError[]): string[];
};

/**
 *  List of the unsupported/broken backend errors
 */
const contextErrors: ContextErrors = {
  account_login: {
    "0": "login_no_matching_customer_internal",
  },
};

export function useApiErrorsResolver(context?: string): UseApiErrorsResolver {
  const { $i18n } = useNuxtApp();
  const { t, te } = $i18n;

  const resolveApiErrors = (errors: ApiError[]) => {
    const errorsTable = errors.map(({ detail, code, meta }) => {
      /**
       * In some cases, parameters errors
       * comes with additional special characters.
       * We have to remove them
       *
       * Example:
       *   "meta": {
       *          "parameters": {
       *             "{{ email }}": "<value>>"
       *        }
       *   }
       */
      if (meta?.parameters) {
        const pureMeta: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(meta?.parameters)) {
          pureMeta[key.replace(/[^a-zA-Z0-9 ]/g, "")] = value;
        }
        meta.parameters = pureMeta;
      }

      if (code && te(`errors.${code}`)) {
        return t(`errors.${code}`, { ...meta?.parameters });
      }
      if (context && code && contextErrors[context][code]) {
        return t(`errors.${contextErrors[context][code]}`);
      }

      return detail || "No details provided";
    });

    return errorsTable;
  };

  return {
    resolveApiErrors,
  };
}
