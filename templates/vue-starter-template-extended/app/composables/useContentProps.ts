import { type ComputedRef, computed } from "vue";
import type { HtmlBindings } from "~/types/content";
import type { Schemas } from "#shopware";

/**
 * Composable for handling content component props
 *
 * Provides:
 * - componentProps: Extracted and typed component-specific props
 * - htmlBindings: HTML attributes ready to spread on root element
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const props = defineProps<ContentComponentProps<Schemas["ContentTextProps"]>>();
 * const { componentProps, htmlBindings } = useContentProps(props);
 *
 * const title = componentProps.value.title ?? "";
 * </script>
 *
 * <template>
 *   <div v-bind="htmlBindings">{{ title }}</div>
 * </template>
 * ```
 */
export function useContentProps<T>(props: {
  htmlProps?: Schemas["ContentHtmlProps"];
  props?: T;
}): {
  componentProps: ComputedRef<T>;
  htmlBindings: ComputedRef<HtmlBindings>;
} {
  /**
   * Component-specific props with type safety
   */
  const componentProps = computed(() => (props.props ?? {}) as T);

  /**
   * HTML bindings converted from schema format to Vue bindings
   * Maps camelCase schema props to proper HTML attributes
   */
  const htmlBindings = computed<HtmlBindings>(() => {
    const hp = props.htmlProps;
    if (!hp) return {};

    return {
      class: hp.class,
      id: hp.id,
      style: hp.style,
      role: hp.role,
      "aria-label": hp.ariaLabel,
      "aria-describedby": hp.ariaDescribedby,
      "aria-hidden": hp.ariaHidden,
      "data-testid": hp.dataTestid,
    };
  });

  return {
    componentProps,
    htmlBindings,
  };
}

/**
 * Helper to get a prop value with default
 */
export function getProp<T, K extends keyof T>(
  props: T,
  key: K,
  defaultValue: NonNullable<T[K]>,
): NonNullable<T[K]> {
  return (props[key] ?? defaultValue) as NonNullable<T[K]>;
}
