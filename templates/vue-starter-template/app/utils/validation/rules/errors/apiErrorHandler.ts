import { ApiClientError } from "@shopware/api-client";

export function apiErrorHandler(
  error: unknown,
  context: string,
  errorResolver: (error: string) => void,
) {
  const { t } = useI18n();

  if (error instanceof ApiClientError) {
    const { resolveApiErrors } = useApiErrorsResolver(context);
    const errors = resolveApiErrors(error.details.errors);

    for (const error of errors) {
      errorResolver(error);
    }
  } else {
    errorResolver(t("errors.message-default") as string);
  }
}
