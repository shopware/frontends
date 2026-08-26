/**
 * Splits fallthrough attributes for form components that wrap a real control.
 *
 * `class` and `style` stay on the wrapper, everything else (`data-*`, `name`,
 * `required`, `aria-*`, listeners) goes to the `<input>` or `<select>`.
 * Use it together with `defineOptions({ inheritAttrs: false })`.
 */
export function useControlAttrs() {
  const attrs = useAttrs();

  const wrapperAttrs = computed(() => ({
    class: attrs.class,
    style: attrs.style,
  }));

  const controlAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs;
    return rest;
  });

  return { wrapperAttrs, controlAttrs };
}
