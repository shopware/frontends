<script setup lang="ts">
import { type VNode, computed, h, resolveComponent } from "vue";
import { parseComponentType } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["ContentPage"];
}>();

const contentElements = computed<Schemas["ContentElement"][]>(() => {
  return props.content?.elements || [];
});

/**
 * Resolve a content element component name
 * Converts component type "Sw:Content:Text" to "ContentText"
 * Converts component type "Sw:Grid" to "ContentGrid"
 */
function resolveContentComponent(element: Schemas["ContentElement"]) {
  const { category, name } = parseComponentType(element.component);

  // Build component name: Content + Category (optional) + Name
  // Examples:
  // - "Sw:Content:Text" => "ContentText"
  // - "Sw:Product:Card" => "ContentProductCard"
  // - "Sw:Grid" => "ContentGrid"
  const componentName =
    category && category !== "Content"
      ? `Content${category}${name}`
      : `Content${name}`;

  try {
    const resolved = resolveComponent(componentName);
    return {
      componentName,
      resolvedComponent: typeof resolved !== "string" ? resolved : undefined,
      isResolved: typeof resolved !== "string",
    };
  } catch (e) {
    return {
      componentName,
      resolvedComponent: undefined,
      isResolved: false,
      error: (e as Error).message,
    };
  }
}

/**
 * Render a content element with its properties and slots
 */
function renderElement(element: Schemas["ContentElement"]) {
  const { resolvedComponent, componentName, isResolved } =
    resolveContentComponent(element);

  // If component not resolved, render fallback
  if (!isResolved || !resolvedComponent) {
    return h(
      "div",
      {
        class: "content-element-fallback",
        "data-component": element.component,
        "data-element-id": element.id,
      },
      `Component not found: ${componentName} (${element.component})`,
    );
  }

  // Prepare props for the element component
  const elementProps = {
    element,
    htmlProps: element.htmlProps,
    props: element.props,
    "data-element-id": element.id,
    "data-component": element.component,
  };

  // Render slots if present
  const slots: Record<string, () => VNode[]> = {};

  if (element.slots && !Array.isArray(element.slots)) {
    for (const [slotName, slotContent] of Object.entries(element.slots)) {
      slots[slotName] = () =>
        slotContent.elements.map((childElement) => renderElement(childElement));
    }
  }

  return h(resolvedComponent, elementProps, slots);
}

const DynamicRender = () => {
  return contentElements.value.map((element) => renderElement(element));
};
</script>

<template>
  <DynamicRender />
</template>
