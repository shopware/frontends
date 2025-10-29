<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";

// Import UI components from cms-base-layer
// These are simpler components that don't require complex Shopware data structures
const BaseButton = defineAsyncComponent(
  () => import("@shopware/cms-base-layer/app/components/ui/BaseButton.vue"),
);

const showMessage = ref(false);

function handleClick() {
  showMessage.value = true;
  setTimeout(() => {
    showMessage.value = false;
  }, 3000);
}
</script>

<template>
  <div class="space-y-8">
    <!-- Button Examples -->
    <section class="border border-outline-primary rounded-lg p-6">
      <h3 class="text-2xl font-semibold mb-4 text-brand-primary">BaseButton Component</h3>

      <div class="space-y-4">
        <!-- Suspense requires a single root element in the default slot -->
        <Suspense>
          <template #default>
            <div class="flex flex-wrap gap-4">
              <BaseButton @click="handleClick">
                Default Button
              </BaseButton>

              <BaseButton class="bg-brand-primary text-white hover:bg-brand-primary-dark" @click="handleClick">
                Primary Button
              </BaseButton>

              <BaseButton class="border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" @click="handleClick">
                Outlined Button
              </BaseButton>
            </div>
          </template>
          <template #fallback>
            <div class="animate-pulse">Loading buttons...</div>
          </template>
        </Suspense>

        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-if="showMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Button clicked! This message will disappear in 3 seconds.
          </div>
        </Transition>
      </div>

      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-brand-primary">
          View usage
        </summary>
        <pre class="mt-2 text-xs bg-gray-100 p-4 rounded overflow-x-auto"><code>&lt;BaseButton @click="handleClick"&gt;
  Default Button
&lt;/BaseButton&gt;

&lt;BaseButton
  class="bg-brand-primary text-white hover:bg-brand-primary-dark"
  @click="handleClick"
&gt;
  Primary Button
&lt;/BaseButton&gt;</code></pre>
      </details>
    </section>

    <!-- Component Info -->
    <section class="bg-surface-secondary rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4">About UI Components</h3>
      <p class="mb-4">
        The cms-base-layer includes several reusable UI components that can be used in any Vue/Astro project:
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li><code>BaseButton.vue</code> - Flexible button component with customizable styling</li>
        <li><code>IconButton.vue</code> - Button with icon support</li>
        <li><code>WishlistIcon.vue</code> - Wishlist toggle icon component</li>
        <li>And many more in <code>app/components/ui/</code></li>
      </ul>
    </section>

    <!-- Integration Notes -->
    <section class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-2">💡 Why UI Components Work Well</h3>
      <ul class="list-disc list-inside space-y-2 text-sm">
        <li>UI components are mostly presentational without heavy Shopware dependencies</li>
        <li>They don't require complex CMS data structures</li>
        <li>Easy to integrate with custom styling using UnoCSS/Tailwind classes</li>
        <li>Can be used as building blocks for custom components</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
