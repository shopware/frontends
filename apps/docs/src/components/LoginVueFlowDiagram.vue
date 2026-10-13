<script setup lang="ts">
import { Handle, Position, VueFlow } from "@vue-flow/core";
import type { Edge, Node, VueFlowStore } from "@vue-flow/core";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import SchemaTypeTooltip from "./SchemaTypeTooltip.vue";

type FlowStepData = {
  kind: "ui" | "composable" | "api" | "context" | "cart";
  label: string;
  action: string;
  title: string;
  description: string;
  code: string;
  state: string;
  typeKeys: string[];
};

// Nodes are laid out left to right. The two Store API calls are stacked in
// one column and connected top to bottom, so they need enough vertical gap
// for the tallest node (three type chips) to never overlap the one below.
const steps: { id: string; x: number; y: number; data: FlowStepData }[] = [
  {
    id: "ui-submit",
    x: 0,
    y: 110,
    data: {
      kind: "ui",
      label: "Login form",
      action: "Submit credentials",
      title: "UI: submit credentials",
      description:
        "The component collects username and password, then calls the composable. Loading and form errors stay local to the UI.",
      code: "submit() -> login(credentials)",
      state: "local form state",
      typeKeys: ['operations["loginCustomer post /account/login"]["body"]'],
    },
  },
  {
    id: "use-user",
    x: 250,
    y: 110,
    data: {
      kind: "composable",
      label: "useUser().login()",
      action: "Run login workflow",
      title: "Composable: own the workflow",
      description:
        "useUser sends credentials to the Store API and then coordinates the context and cart refreshes.",
      code: "useUser().login(credentials)",
      state: "customer workflow",
      typeKeys: [
        'operations["loginCustomer post /account/login"]["body"]',
        'operations["loginCustomer post /account/login"]["response"]',
      ],
    },
  },
  {
    id: "login-api",
    x: 520,
    y: 0,
    data: {
      kind: "api",
      label: "POST /account/login",
      action: "Authenticate customer",
      title: "Store API: authenticate",
      description:
        "The generated operation validates credentials and can affect the active sales channel session.",
      code: "loginCustomer post /account/login",
      state: "sw-context-token",
      typeKeys: [
        'operations["loginCustomer post /account/login"]["body"]',
        'operations["loginCustomer post /account/login"]["response"]',
        'components["schemas"]["failure"]',
      ],
    },
  },
  {
    id: "context",
    x: 520,
    y: 290,
    data: {
      kind: "context",
      label: "GET /context",
      action: "Refresh session",
      title: "Context: refresh session",
      description:
        "The refreshed context provides the current customer, customer group, currency, rules, and other context-dependent values.",
      code: "refreshSessionContext()",
      state: "user, isLoggedIn, sales channel context",
      typeKeys: [
        'operations["readContext get /context"]["response"]',
        'Schemas["Customer"]',
      ],
    },
  },
  {
    id: "cart",
    x: 790,
    y: 110,
    data: {
      kind: "cart",
      label: "refreshCart()",
      action: "Reload cart",
      title: "Cart: reload customer-aware data",
      description:
        "Cart data is loaded again because prices, promotions, and line items can depend on the authenticated customer context.",
      code: "refreshCart()",
      state: "cart, prices, promotions",
      typeKeys: ['Schemas["Cart"]'],
    },
  },
  {
    id: "ui-reactive",
    x: 1040,
    y: 110,
    data: {
      kind: "ui",
      label: "Reactive UI",
      action: "Render new state",
      title: "UI: render new state",
      description:
        "The page reads user, isLoggedIn, and cart data from composables instead of keeping a separate copy.",
      code: "user + isLoggedIn + cart",
      state: "reactive UI",
      typeKeys: ['Schemas["Customer"]', 'Schemas["Cart"]'],
    },
  },
];

// Each Vue Flow instance mutates its nodes (dimensions, selection), so the
// inline and the expanded diagram each get their own copy.
function createNodes(): Node<FlowStepData>[] {
  return steps.map((step) => ({
    id: step.id,
    type: "flowStep",
    position: { x: step.x, y: step.y },
    data: step.data,
  }));
}

function createEdges(): Edge[] {
  const edge = (
    source: string,
    target: string,
    label: string,
    sourceHandle = "right",
    targetHandle = "left",
  ): Edge => ({
    id: `${source}-${target}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    label,
    type: "smoothstep",
    animated: true,
  });

  return [
    edge("ui-submit", "use-user", "calls"),
    edge("use-user", "login-api", "authenticates"),
    edge("login-api", "context", "then refreshes", "bottom", "top"),
    edge("context", "cart", "then reloads"),
    edge("cart", "ui-reactive", "updates"),
  ];
}

const inlineNodes = ref(createNodes());
const inlineEdges = ref(createEdges());
const expandedNodes = ref(createNodes());
const expandedEdges = ref(createEdges());

const isExpanded = ref(false);
const selectedIndex = ref(0);
const selectedStep = computed(() => steps[selectedIndex.value]);

const expandButton = ref<HTMLButtonElement>();
const closeButton = ref<HTMLButtonElement>();
const dialogElement = ref<HTMLElement>();

// While the dialog is open, everything else on the page is made inert, so
// Tab cannot reach the content hidden behind it. The dialog is teleported to
// <body>, so its siblings there are the page itself.
let inertElements: Element[] = [];

function makeBackgroundInert() {
  const dialog = dialogElement.value;
  inertElements = Array.from(document.body.children).filter(
    (element) => element !== dialog && !element.hasAttribute("inert"),
  );
  for (const element of inertElements) {
    element.setAttribute("inert", "");
  }
}

function releaseBackground() {
  for (const element of inertElements) {
    element.removeAttribute("inert");
  }
  inertElements = [];
}
let expandedFlow: VueFlowStore | undefined;

function openExpanded(nodeId?: string) {
  const index = steps.findIndex((step) => step.id === nodeId);
  selectedIndex.value = index >= 0 ? index : 0;
  isExpanded.value = true;
}

function closeExpanded() {
  isExpanded.value = false;
}

function selectStep(index: number) {
  selectedIndex.value = Math.min(Math.max(index, 0), steps.length - 1);
}

function onExpandedNodeClick(event: { node: Node }) {
  selectStep(steps.findIndex((step) => step.id === event.node.id));
}

// Fit only once the pane is ready AND the nodes are measured. The two events
// arrive in either order, and fitting before measuring uses wrong bounds.
let expandedNodesMeasured = false;

function fitExpandedWhenReady() {
  if (expandedFlow && expandedNodesMeasured) {
    requestAnimationFrame(() => expandedFlow?.fitView({ padding: 0.15 }));
  }
}

function onExpandedPaneReady(instance: VueFlowStore) {
  expandedFlow = instance;
  fitExpandedWhenReady();
}

function onExpandedNodesInitialized() {
  expandedNodesMeasured = true;
  fitExpandedWhenReady();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeExpanded();
  }
}

watch(isExpanded, async (open) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.style.overflow = open ? "hidden" : "";

  if (open) {
    document.addEventListener("keydown", onKeydown);
    await nextTick();
    makeBackgroundInert();
    closeButton.value?.focus();
  } else {
    document.removeEventListener("keydown", onKeydown);
    // Release first: an inert element cannot receive focus.
    releaseBackground();
    expandedFlow = undefined;
    expandedNodesMeasured = false;
    // Nodes are not focus targets, so focus always returns to the button.
    expandButton.value?.focus();
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onKeydown);
    document.documentElement.style.overflow = "";
    releaseBackground();
  }
});
</script>

<template>
  <section class="login-vue-flow" aria-label="Login flow overview">
    <div class="login-vue-flow__toolbar">
      <p class="login-vue-flow__hint">
        Click a step to open it in the expanded view.
      </p>
      <button
        ref="expandButton"
        type="button"
        class="login-vue-flow__button"
        @click="openExpanded()"
      >
        <span aria-hidden="true">⤢</span> Expand diagram
      </button>
    </div>

    <div class="login-vue-flow__canvas">
      <VueFlow
        id="login-flow-inline"
        v-model:nodes="inlineNodes"
        v-model:edges="inlineEdges"
        :fit-view-on-init="true"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :elements-selectable="false"
        :pan-on-drag="false"
        :zoom-on-scroll="false"
        :zoom-on-pinch="false"
        :zoom-on-double-click="false"
        :prevent-scrolling="false"
        :min-zoom="0.2"
        :max-zoom="1.2"
        @node-click="(event) => openExpanded(event.node.id)"
      >
        <template #node-flowStep="{ data }">
          <div class="login-flow-node" :class="`login-flow-node--${data.kind}`">
            <Handle id="left" type="target" :position="Position.Left" />
            <Handle id="top" type="target" :position="Position.Top" />
            <strong>{{ data.label }}</strong>
            <span class="login-flow-node__action">{{ data.action }}</span>
            <div class="login-flow-node__types">
              <SchemaTypeTooltip
                v-for="typeKey in data.typeKeys"
                :key="typeKey"
                :type-key="typeKey"
              />
            </div>
            <Handle id="right" type="source" :position="Position.Right" />
            <Handle id="bottom" type="source" :position="Position.Bottom" />
          </div>
        </template>
      </VueFlow>
    </div>

    <Teleport to="body">
      <div
        v-if="isExpanded"
        ref="dialogElement"
        class="login-vue-flow-dialog"
        @click.self="closeExpanded"
      >
        <div
          class="login-vue-flow-dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-vue-flow-dialog-title"
        >
          <header class="login-vue-flow-dialog__header">
            <h2 id="login-vue-flow-dialog-title">Login flow</h2>
            <div class="login-vue-flow-dialog__actions">
              <button
                type="button"
                class="login-vue-flow__button"
                aria-label="Zoom out"
                @click="expandedFlow?.zoomOut()"
              >
                −
              </button>
              <button
                type="button"
                class="login-vue-flow__button"
                aria-label="Zoom in"
                @click="expandedFlow?.zoomIn()"
              >
                +
              </button>
              <button
                type="button"
                class="login-vue-flow__button"
                @click="expandedFlow?.fitView({ padding: 0.15 })"
              >
                Fit
              </button>
              <button
                ref="closeButton"
                type="button"
                class="login-vue-flow__button"
                aria-label="Close expanded diagram"
                @click="closeExpanded"
              >
                ✕
              </button>
            </div>
          </header>

          <div class="login-vue-flow-dialog__body">
            <div class="login-vue-flow-dialog__canvas">
              <VueFlow
                id="login-flow-expanded"
                v-model:nodes="expandedNodes"
                v-model:edges="expandedEdges"
                :nodes-draggable="false"
                :nodes-connectable="false"
                :elements-selectable="false"
                :pan-on-drag="true"
                :zoom-on-scroll="true"
                :zoom-on-double-click="true"
                :min-zoom="0.3"
                :max-zoom="2"
                @pane-ready="onExpandedPaneReady"
                @nodes-initialized="onExpandedNodesInitialized"
                @node-click="onExpandedNodeClick"
              >
                <template #node-flowStep="{ id, data }">
                  <div
                    class="login-flow-node"
                    :class="[
                      `login-flow-node--${data.kind}`,
                      {
                        'login-flow-node--active': id === selectedStep.id,
                      },
                    ]"
                  >
                    <Handle id="left" type="target" :position="Position.Left" />
                    <Handle id="top" type="target" :position="Position.Top" />
                    <strong>{{ data.label }}</strong>
                    <span class="login-flow-node__action">{{
                      data.action
                    }}</span>
                    <div class="login-flow-node__types">
                      <SchemaTypeTooltip
                        v-for="typeKey in data.typeKeys"
                        :key="typeKey"
                        :type-key="typeKey"
                      />
                    </div>
                    <Handle
                      id="right"
                      type="source"
                      :position="Position.Right"
                    />
                    <Handle
                      id="bottom"
                      type="source"
                      :position="Position.Bottom"
                    />
                  </div>
                </template>
              </VueFlow>
            </div>

            <aside class="login-vue-flow-dialog__detail" aria-live="polite">
              <p class="login-vue-flow-dialog__eyebrow">
                Step {{ selectedIndex + 1 }} of {{ steps.length }}
              </p>
              <h3>{{ selectedStep.data.title }}</h3>
              <p>{{ selectedStep.data.description }}</p>
              <dl>
                <dt>Code</dt>
                <dd>
                  <pre><code>{{ selectedStep.data.code }}</code></pre>
                </dd>
                <dt>State</dt>
                <dd>{{ selectedStep.data.state }}</dd>
                <dt>Types</dt>
                <dd class="login-vue-flow-dialog__types">
                  <SchemaTypeTooltip
                    v-for="typeKey in selectedStep.data.typeKeys"
                    :key="typeKey"
                    :type-key="typeKey"
                  />
                </dd>
              </dl>
              <div class="login-vue-flow-dialog__nav">
                <button
                  type="button"
                  class="login-vue-flow__button"
                  :disabled="selectedIndex === 0"
                  @click="selectStep(selectedIndex - 1)"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  class="login-vue-flow__button"
                  :disabled="selectedIndex === steps.length - 1"
                  @click="selectStep(selectedIndex + 1)"
                >
                  Next →
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style>
/* Unscoped: these target elements rendered by Vue Flow and the teleported
   dialog. Every selector is namespaced under a login-vue-flow class. */
.login-vue-flow .vue-flow__node-flowStep,
.login-vue-flow-dialog .vue-flow__node-flowStep {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.login-flow-node {
  width: 200px;
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-top-width: 4px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-size: 13px;
  text-align: center;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.vue-flow__node-flowStep:hover .login-flow-node {
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14);
}

.login-flow-node--active {
  border-color: var(--vp-c-brand-1);
  box-shadow:
    0 0 0 3px var(--vp-c-brand-soft),
    0 10px 24px rgba(0, 0, 0, 0.1);
}

.login-flow-node strong {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.login-flow-node__action {
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.35;
}

.login-flow-node__types {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.login-flow-node--ui {
  border-top-color: #2563eb;
}

.login-flow-node--composable {
  border-top-color: #7c3aed;
}

.login-flow-node--api {
  border-top-color: #0891b2;
}

.login-flow-node--context {
  border-top-color: #16a34a;
}

.login-flow-node--cart {
  border-top-color: #ea580c;
}

/* Handles only anchor the edges; they are not interactive. */
.login-flow-node .vue-flow__handle {
  opacity: 0;
  pointer-events: none;
}

.login-vue-flow .vue-flow__edge-path,
.login-vue-flow-dialog .vue-flow__edge-path {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.login-vue-flow .vue-flow__edge-textbg,
.login-vue-flow-dialog .vue-flow__edge-textbg {
  fill: var(--vp-c-bg);
}

.login-vue-flow .vue-flow__edge-text,
.login-vue-flow-dialog .vue-flow__edge-text {
  fill: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
}

.login-vue-flow__button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 36px;
  height: 36px;
  justify-content: center;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.login-vue-flow__button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.login-vue-flow__button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.login-vue-flow__button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.login-vue-flow-dialog {
  position: fixed;
  inset: 0;
  z-index: 99;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.55);
}

.login-vue-flow-dialog__panel {
  width: min(1400px, 100%);
  height: min(860px, 100%);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}

.login-vue-flow-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px 12px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.login-vue-flow-dialog__header h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 18px;
  line-height: 1.4;
}

.login-vue-flow-dialog__actions {
  display: flex;
  gap: 8px;
}

.login-vue-flow-dialog__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  min-height: 0;
}

.login-vue-flow-dialog__canvas {
  min-height: 0;
  background: var(--vp-c-bg-soft);
}

.login-vue-flow-dialog__detail {
  overflow-y: auto;
  padding: 24px;
  border-left: 1px solid var(--vp-c-divider);
}

.login-vue-flow-dialog__detail h3 {
  margin: 0 0 10px;
  font-size: 20px;
  line-height: 1.35;
}

.login-vue-flow-dialog__detail p {
  margin: 0;
  line-height: 1.65;
}

.login-vue-flow-dialog__eyebrow {
  margin-bottom: 8px !important;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.login-vue-flow-dialog__detail dl {
  margin: 20px 0 0;
}

.login-vue-flow-dialog__detail dt {
  margin: 16px 0 6px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.login-vue-flow-dialog__detail dd {
  margin: 0;
  font-size: 14px;
}

.login-vue-flow-dialog__detail pre {
  margin: 0;
  padding: 10px 12px;
  overflow-x: auto;
  border-radius: 6px;
  background: var(--vp-code-block-bg, var(--vp-c-bg-alt));
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.login-vue-flow-dialog__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.login-vue-flow-dialog__nav {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 28px;
}

@media (max-width: 860px) {
  .login-vue-flow-dialog {
    padding: 0;
  }

  .login-vue-flow-dialog__panel {
    height: 100%;
    border-radius: 0;
  }

  .login-vue-flow-dialog__body {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
  }

  .login-vue-flow-dialog__detail {
    max-height: 45vh;
    border-top: 1px solid var(--vp-c-divider);
    border-left: 0;
  }
}
</style>

<style scoped>
.login-vue-flow {
  margin: 24px 0;
}

.login-vue-flow__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-bottom: 12px;
}

.login-vue-flow__hint {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.login-vue-flow__canvas {
  height: 380px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

/* The inline view always fits the whole flow; on narrow screens it gets
   small, which is what the expand button is for. */
@media (max-width: 640px) {
  .login-vue-flow__canvas {
    height: 240px;
  }
}
</style>
