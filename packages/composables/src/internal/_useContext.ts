import { inject, provide, ref, Ref, unref } from "vue";

/**
 * Internal context helper
 */
export function _useContext<T>(
  injectionName: string,
  params?: {
    context?: Ref<T> | T;
    replace?: T;
  }
) {
  const isNewContext = !!params?.context;

  const _context: Ref<T> = isNewContext
    ? (ref(unref(params?.context)) as Ref<T>)
    : (inject(injectionName, ref()) as Ref<T>);
  provide(injectionName, _context);

  /**
   * Used for global context to replace it with new Value. Used mainly for session context
   */
  if (!!params?.replace) {
    _context.value = unref(params.replace);
  }

  return _context;
}
