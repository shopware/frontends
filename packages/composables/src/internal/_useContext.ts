import { inject, provide, ref, Ref, unref } from "vue";

/**
 * Internal context helper
 */
export function _useContext<T>(injectionName: string, context?: Ref<T> | T) {
  const isNewContext = !!context;
  const _context: Ref<T> = isNewContext
    ? (ref(unref(context)) as Ref<T>)
    : (inject(injectionName) as Ref<T>);
  provide(injectionName, _context);

  return _context;
}
