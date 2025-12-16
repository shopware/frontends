import type { ComputedRef } from "vue";

/**
 * Generic content component configuration
 * This allows creating new content components in a declarative way
 */
export interface ContentComponentConfig<T extends Record<string, unknown>> {
  /**
   * Property schema with defaults
   */
  properties: {
    [K in keyof T]: {
      default: T[K];
      type?: string;
      validator?: (value: unknown) => boolean;
    };
  };

  /**
   * Computed properties that depend on the extracted props
   */
  computed?: (props: T) => Record<string, ComputedRef<unknown>>;

  /**
   * Class mappings for style variants
   */
  classMappers?: {
    [key: string]: Record<string, string>;
  };
}

/**
 * Create a typed content component setup
 *
 * @example
 * ```ts
 * const setup = useContentFactory<ButtonProperties>({
 *   properties: {
 *     text: { default: "" },
 *     variant: { default: "primary" },
 *     size: { default: "medium" }
 *   },
 *   classMappers: {
 *     variant: BUTTON_VARIANT_CLASSES,
 *     size: SIZE_CLASSES
 *   }
 * }, props.properties);
 *
 * // Use in template
 * {{ setup.props.text }}
 * :class="setup.getClass('variant')"
 * ```
 */
export function useContentFactory<T extends Record<string, unknown>>(
  config: ContentComponentConfig<T>,
  properties: Record<string, unknown>,
) {
  // Extract properties with defaults
  const props = {} as T;
  for (const [key, propConfig] of Object.entries(config.properties)) {
    const value = properties[key];
    props[key as keyof T] = (
      value !== undefined ? value : propConfig.default
    ) as T[keyof T];
  }

  // Create computed properties if provided
  const computedProps = config.computed ? config.computed(props) : {};

  // Helper to get mapped class
  const getClass = (mapperKey: string, propKey?: string) => {
    const key = propKey || mapperKey;
    const mapper = config.classMappers?.[mapperKey];
    if (!mapper) return "";

    const value = props[key as keyof T];
    return mapper[String(value)] || mapper[Object.keys(mapper)[0] || ""];
  };

  // Helper to get multiple classes
  const getClasses = (...mapperKeys: string[]) => {
    return mapperKeys.map((key) => getClass(key)).filter(Boolean);
  };

  return {
    props,
    computed: computedProps,
    getClass,
    getClasses,
  };
}

/**
 * Alternative: Function-based property extractor with validation
 * Returns Required<T> to ensure all properties have values (from defaults or properties)
 */
export function extractProperties<T extends Record<string, unknown>>(
  properties: Record<string, unknown>,
  schema: {
    [K in keyof T]-?: {
      default: NonNullable<T[K]>;
      required?: boolean;
      validate?: (value: unknown) => boolean;
    };
  },
): Required<T> {
  const result = {} as Required<T>;

  for (const [key, config] of Object.entries(schema) as Array<
    [keyof T, (typeof schema)[keyof T]]
  >) {
    const value = properties[key as string];

    // Check if required
    if (config.required && value === undefined) {
      console.warn(`Required property "${String(key)}" is missing`);
    }

    // Validate if validator provided
    if (value !== undefined && config.validate && !config.validate(value)) {
      console.warn(
        `Property "${String(key)}" failed validation, using default`,
      );
      result[key] = config.default as Required<T>[keyof T];
      continue;
    }

    result[key] = (
      value !== undefined ? value : config.default
    ) as Required<T>[keyof T];
  }

  return result;
}

/**
 * Helper to create a class mapper function
 */
export function createClassMapper<T extends string>(
  mapping: Record<T, string>,
  fallback?: T,
) {
  return (value: T | string | undefined): string => {
    if (!value) return fallback ? mapping[fallback] : "";
    return mapping[value as T] || (fallback ? mapping[fallback] : "");
  };
}

/**
 * Reactive property getter with computed support
 */
export function useReactiveProperties<T extends Record<string, unknown>>(
  properties: Record<string, unknown>,
  defaults: Partial<T> = {},
) {
  return new Proxy({} as T, {
    get(_, prop: string | symbol) {
      const key = String(prop);
      const value = properties[key];
      return value !== undefined ? value : defaults[key as keyof T];
    },
  });
}
