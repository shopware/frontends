import { ref, unref } from "vue";
import { provideLocal, injectLocal } from "@vueuse/core";
import type { Ref } from "vue";

/**
 * Context helper composable to provide and inject data.
 * It takes `injectionName` to inject the context. If no context is provided, it will create a new one and provide it.
 * If `context` is provided in params, it will create new context, use param as value and provide it.
 * If `replace` is provided, it will replace the existing context with the new value.
 *
 * @public
 * @category Context & Language
 */
export function useContext<T>(
  injectionName: string,
  params?: {
    context?: Ref<T> | T;
    replace?: T;
  },
) {
  const isNewContext = !!params?.context;

  const _context: Ref<T> = isNewContext
    ? (ref(unref(params?.context)) as Ref<T>)
    : (injectLocal(injectionName, ref()) as Ref<T>);
  provideLocal(injectionName, _context);

  /**
   * Used for global context to replace it with new Value. Used mainly for session context
   */
  if (params?.replace) {
    _context.value = unref(params.replace);
  }

  return _context;
}
