import type {
  CmsActionError,
  CmsActions,
} from "../../actions/CmsActionsContext";
import { getCmsTranslate } from "../../translations";

export function notifyCartErrors(
  actions: Pick<CmsActions, "notify">,
  errors: CmsActionError[] | undefined,
  messages: Record<string, string>,
): boolean {
  for (const { messageKey, params } of errors ?? []) {
    const text = messages[messageKey];
    if (text) {
      actions.notify({ type: "error", message: getCmsTranslate(text, params) });
    }
  }
  return (errors?.length ?? 0) > 0;
}
