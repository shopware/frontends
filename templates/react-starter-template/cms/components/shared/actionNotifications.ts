import type {
  CmsActionResult,
  CmsActions,
} from "../../actions/CmsActionsContext";
import { getCmsTranslate } from "../../translations";

export const DEFAULT_FAILURE_MESSAGE =
  "Something went wrong. Please try again.";

export type ActionFailureOptions = {
  messages?: Record<string, string>;
  fallback?: string;
};

export function getActionFailureMessages(
  result: Pick<CmsActionResult, "message" | "errors">,
  {
    messages = {},
    fallback = DEFAULT_FAILURE_MESSAGE,
  }: ActionFailureOptions = {},
): string[] {
  const translated = (result.errors ?? []).flatMap(({ messageKey, params }) => {
    const text = messages[messageKey];
    return text ? [getCmsTranslate(text, params)] : [];
  });
  return translated.length ? translated : [result.message || fallback];
}

export function notifyActionFailure(
  actions: Pick<CmsActions, "notify">,
  result: Pick<CmsActionResult, "message" | "errors">,
  options?: ActionFailureOptions,
): void {
  for (const message of getActionFailureMessages(result, options)) {
    actions.notify({ type: "error", message });
  }
}

export function notifyActionError(
  actions: Pick<CmsActions, "notify">,
  error: unknown,
  options?: ActionFailureOptions,
): void {
  console.error("[CMS] action failed", error);
  notifyActionFailure(actions, {}, options);
}
