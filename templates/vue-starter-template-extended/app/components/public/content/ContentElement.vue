<script setup lang="ts">
import {
  type Component,
  type VNode,
  computed,
  getCurrentInstance,
  h,
  resolveComponent,
} from "vue";
import { parseComponentType } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
}>();

/**
 * Render child elements from slots
 */
function renderSlotElements(slotContent: Schemas["ContentSlotContent"]) {
  // Get reference to self for recursive rendering
  const instance = getCurrentInstance();
  const selfComponent = instance?.type || "div";

  return slotContent.elements.map((childElement) =>
    h(selfComponent, { element: childElement, key: childElement.id }),
  );
}

const slots = computed(() => {
  if (!props.element.slots || Array.isArray(props.element.slots)) {
    return {};
  }

  const result: Record<string, () => VNode[]> = {};

  for (const [slotName, slotContent] of Object.entries(props.element.slots)) {
    result[slotName] = () => renderSlotElements(slotContent);
  }

  return result;
});

const DynamicRender = () => {
  // Parse component type: "Sw:Content:Text" -> { category: "Content", name: "Text" }
  const { category, name } = parseComponentType(props.element.component);

  // Build Vue component name
  // "Sw:Content:Text" -> "ContentText" (skip redundant "Content" category)
  // "Sw:Product:Card" -> "ContentProductCard"
  const componentName =
    category && category !== "Content"
      ? `Content${category}${name}`
      : `Content${name}`;

  // Resolve component within render context
  let resolvedComponent: Component | string | undefined;
  let isResolved = false;

  try {
    resolvedComponent = resolveComponent(componentName);
    isResolved = typeof resolvedComponent !== "string";
  } catch {
    // Component not found - will render fallback
  }

  // If component not resolved, render fallback
  if (!isResolved || !resolvedComponent) {
    return h(
      "div",
      {
        class:
          "content-element-fallback border border-dashed border-gray-300 p-4 rounded",
        "data-component": props.element.component,
        "data-element-id": props.element.id,
      },
      [
        h("div", { class: "text-sm text-gray-600" }, [
          h("strong", {}, "Missing Component:"),
          ` ${componentName}`,
        ]),
        h(
          "div",
          { class: "text-xs text-gray-500" },
          `Type: ${props.element.component}`,
        ),
        h(
          "div",
          { class: "text-xs text-gray-500" },
          `Element ID: ${props.element.id}`,
        ),
      ],
    );
  }

  // Render the resolved component with separated props
  return h(
    resolvedComponent,
    {
      element: props.element,
      // Separated props from schema
      htmlProps: props.element.htmlProps,
      props: props.element.props,
      "data-element-id": props.element.id,
      "data-component": props.element.component,
    },
    slots.value,
  );
};
</script>

<template>
  <DynamicRender />
</template>
