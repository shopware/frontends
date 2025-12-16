# Content Component Patterns

This document outlines different approaches to building content components, from basic to highly agnostic.

## Evolution of Approaches

### ❌ Level 0: Original (Most Boilerplate)

```vue
<script setup lang="ts">
import { computed } from "vue";
import { getElementProperty } from "~/composables/contentHelpers";

const text = computed(() => getElementProperty<string>(props.element, "text", ""));
const variant = computed(() => getElementProperty<string>(props.element, "variant", "primary"));

const variantClass = computed(() => {
  const map = { primary: "bg-blue-600", secondary: "bg-gray-600" };
  return map[variant.value] || map.primary;
});
</script>
```

**Problems:**
- Lots of boilerplate computed properties
- Repeated `getElementProperty` calls
- Hardcoded class mappings in every component
- No type safety for properties
- `.value` needed everywhere

---

### ✅ Level 1: Direct Property Access (Current)

```vue
<script setup lang="ts">
const text = (props.properties.text as string) || "";
const variant = (props.properties.variant as "primary" | "secondary") || "primary";

const variantClass = computed(() => {
  const map = { primary: "bg-blue-600", secondary: "bg-gray-600" };
  return map[variant] || map.primary;
});
</script>
```

**Improvements:**
- ✅ Removed boilerplate computed properties
- ✅ Direct property access
- ✅ No `.value` needed
- ❌ Still manual type assertions
- ❌ Class mappings still duplicated

---

### ✅✅ Level 2: Typed Composables + Shared Styles

```vue
<script setup lang="ts">
import { useContentProperties, type ButtonProperties } from "~/composables/useContentProperties";
import { BUTTON_VARIANT_CLASSES, SIZE_CLASSES } from "~/composables/useContentStyles";

const { get } = useContentProperties<ButtonProperties>(props.properties);

const text = get("text", "");
const variant = get("variant", "primary");
const size = get("size", "medium");

const variantClass = computed(() =>
  BUTTON_VARIANT_CLASSES[variant] || BUTTON_VARIANT_CLASSES.primary
);
</script>
```

**Improvements:**
- ✅ Type-safe property extraction
- ✅ Shared style configurations
- ✅ Consistent styling across components
- ✅ Reusable property interfaces
- ❌ Still some boilerplate for class mapping

---

### ✅✅✅ Level 3: Factory Pattern (Most Agnostic)

```vue
<script setup lang="ts">
import { useContentFactory } from "~/composables/useContentFactory";
import type { ButtonProperties } from "~/composables/useContentProperties";
import { BUTTON_VARIANT_CLASSES, SIZE_CLASSES } from "~/composables/useContentStyles";

// Declarative component definition
const setup = useContentFactory<ButtonProperties>(
  {
    properties: {
      text: { default: "" },
      variant: { default: "primary" },
      size: { default: "medium" },
    },
    classMappers: {
      variant: BUTTON_VARIANT_CLASSES,
      size: SIZE_CLASSES,
    },
  },
  props.properties,
);

const { text, variant, size } = setup.props;
</script>

<template>
  <button :class="setup.getClasses('variant', 'size')">
    {{ text }}
  </button>
</template>
```

**Improvements:**
- ✅ Fully declarative component definition
- ✅ Zero boilerplate for property extraction
- ✅ Automatic class mapping
- ✅ Easy to add validation
- ✅ Consistent pattern across all components
- ✅ Maximum reusability

---

## Shared Utilities

### 1. Property Types (`useContentProperties.ts`)

Define typed interfaces for each component:

```ts
export interface ButtonProperties {
  text?: string;
  url?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
}

export interface ImageProperties {
  media?: Schemas["Media"];
  url?: string;
  alt?: string;
  displayMode?: "standard" | "cover" | "contain" | "auto";
}
```

### 2. Style Configurations (`useContentStyles.ts`)

Centralized style mappings:

```ts
export const BUTTON_VARIANT_CLASSES = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  outline: "bg-transparent hover:bg-gray-50 text-gray-900 border-gray-300",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
};

export const ALIGNMENT_FLEX_CLASSES = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export const SIZE_CLASSES = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};
```

### 3. Factory Pattern (`useContentFactory.ts`)

Declarative component creation:

```ts
export function useContentFactory<T>(config, properties) {
  // Extract properties with defaults
  // Apply class mappers
  // Return setup object
}
```

---

## Benefits of the Agnostic Approach

1. **Consistency**: All components follow the same pattern
2. **Type Safety**: Full TypeScript support with interfaces
3. **Reusability**: Shared styles and configurations
4. **Maintainability**: Update styles in one place
5. **Scalability**: Easy to add new components
6. **Testability**: Logic separated from presentation
7. **DX**: Less code to write, clearer intent

---

## Creating a New Component

### Level 1 Approach (Current)
```vue
<script setup lang="ts">
const title = (props.properties.title as string) || "";
const alignment = (props.properties.alignment as "left" | "center" | "right") || "left";

const alignmentClass = computed(() => {
  const map = { left: "text-left", center: "text-center", right: "text-right" };
  return map[alignment] || "text-left";
});
</script>
```

### Level 3 Approach (Factory)
```vue
<script setup lang="ts">
import { useContentFactory } from "~/composables/useContentFactory";
import { ALIGNMENT_TEXT_CLASSES } from "~/composables/useContentStyles";

interface MyComponentProperties {
  title?: string;
  alignment?: "left" | "center" | "right";
}

const setup = useContentFactory<MyComponentProperties>(
  {
    properties: {
      title: { default: "" },
      alignment: { default: "left" },
    },
    classMappers: {
      alignment: ALIGNMENT_TEXT_CLASSES,
    },
  },
  props.properties,
);
</script>

<template>
  <div :class="setup.getClass('alignment')">
    <h1>{{ setup.props.title }}</h1>
  </div>
</template>
```

---

## Migration Path

1. **Phase 1**: Keep current Level 1 approach, but add shared style configurations
2. **Phase 2**: Create property type interfaces for better type safety
3. **Phase 3**: Gradually migrate to factory pattern for new components
4. **Phase 4**: Refactor existing components to use factory pattern

---

## Advanced Features

### Property Validation

```ts
const setup = useContentFactory({
  properties: {
    email: {
      default: "",
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
    },
    age: {
      default: 0,
      validator: (value) => Number(value) >= 0 && Number(value) <= 120,
    },
  },
}, props.properties);
```

### Computed Properties

```ts
const setup = useContentFactory<ButtonProperties>(
  {
    properties: { /* ... */ },
    computed: (props) => ({
      isExternal: computed(() =>
        props.url?.startsWith("http://") || props.url?.startsWith("https://")
      ),
      buttonLabel: computed(() =>
        props.text || props.icon ? props.text : "Click me"
      ),
    }),
  },
  props.properties,
);

// Use in template
{{ setup.computed.buttonLabel }}
```

---

## Best Practices

1. **Always define property interfaces** - Better type safety and IDE support
2. **Centralize style mappings** - Update once, apply everywhere
3. **Use semantic naming** - `ALIGNMENT_FLEX_CLASSES` vs `ALIGN_MAP`
4. **Provide sensible defaults** - Components should work with minimal config
5. **Document expected properties** - JSDoc comments for each interface
6. **Keep templates simple** - Logic in setup, presentation in template
7. **Leverage class helpers** - `setup.getClass()` and `setup.getClasses()`

---

## Summary

The factory pattern makes content components **highly agnostic** by:

- **Declarative configuration** instead of imperative code
- **Type-safe property extraction** with automatic defaults
- **Shared style mappings** for consistency
- **Minimal boilerplate** for new components
- **Easy validation** and computed properties
- **Better testing** through separation of concerns

Choose the level that fits your needs, but Level 3 provides the most maintainable and scalable approach.
