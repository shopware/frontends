<script setup lang="ts">
import type { Schemas } from "#shopware";

/**
 * ContentButton - Renders a button/link element
 */

// Component-specific props (add to schema later)
type ButtonProps = {
  text?: string;
  url?: string;
  newTab?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
};

const props = defineProps<{
  element: Schemas["ContentElement"];
  htmlProps?: Schemas["ContentHtmlProps"];
  props?: ButtonProps;
}>();

const componentProps = (props.props ?? {}) as ButtonProps;

// Extract with defaults
const text = componentProps.text ?? "Click here";
const url = componentProps.url ?? "";
const newTab = componentProps.newTab ?? false;
const variant = componentProps.variant ?? "primary";
const size = componentProps.size ?? "medium";

// Variant classes
const variantClasses: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 border-gray-600",
  outline: "bg-transparent text-blue-600 hover:bg-blue-50 border-blue-600",
};

// Size classes
const sizeClasses: Record<string, string> = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

const linkTarget = newTab ? "_blank" : "_self";
const linkRel = newTab ? "noopener noreferrer" : undefined;
</script>

<template>
  <div class="content-button">
    <a
      v-if="url"
      :href="url"
      :target="linkTarget"
      :rel="linkRel"
      class="inline-flex items-center justify-center font-medium rounded-md border transition-colors"
      :class="[variantClasses[variant], sizeClasses[size]]"
    >
      {{ text }}
      <slot />
    </a>
    <button
      v-else
      type="button"
      class="inline-flex items-center justify-center font-medium rounded-md border transition-colors"
      :class="[variantClasses[variant], sizeClasses[size]]"
    >
      {{ text }}
      <slot />
    </button>
  </div>
</template>
