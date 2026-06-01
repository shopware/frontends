<script setup lang="ts">
import { VueFlow } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { computed, ref } from "vue";

const nodes = ref([
  {
    id: "ui-submit",
    label: "Login form",
    position: { x: 0, y: 80 },
    class: "login-vue-flow__node login-vue-flow__node--ui",
    data: {
      title: "UI: submit credentials",
      description:
        "The component collects username and password, then calls the composable. Loading and form errors stay local to the UI.",
      code: "submit() -> login(credentials)",
      state: "local form state",
    },
  },
  {
    id: "use-user",
    label: "useUser().login()",
    position: { x: 240, y: 80 },
    class: "login-vue-flow__node login-vue-flow__node--composable",
    data: {
      title: "Composable: own the workflow",
      description:
        "useUser sends credentials to the Store API and then coordinates the context and cart refreshes.",
      code: "useUser().login(credentials)",
      state: "customer workflow",
    },
  },
  {
    id: "login-api",
    label: "POST /account/login",
    position: { x: 520, y: 0 },
    class: "login-vue-flow__node login-vue-flow__node--api",
    data: {
      title: "Store API: authenticate",
      description:
        "The generated operation validates credentials and can affect the active sales channel session.",
      code: "loginCustomer post /account/login",
      state: "sw-context-token",
    },
  },
  {
    id: "context",
    label: "GET /context",
    position: { x: 520, y: 170 },
    class: "login-vue-flow__node login-vue-flow__node--context",
    data: {
      title: "Context: refresh session",
      description:
        "The refreshed context provides the current customer, customer group, currency, rules, and other context-dependent values.",
      code: "refreshSessionContext()",
      state: "user, isLoggedIn, sales channel context",
    },
  },
  {
    id: "cart",
    label: "refreshCart()",
    position: { x: 800, y: 80 },
    class: "login-vue-flow__node login-vue-flow__node--cart",
    data: {
      title: "Cart: reload customer-aware data",
      description:
        "Cart data is loaded again because prices, promotions, and line items can depend on the authenticated customer context.",
      code: "refreshCart()",
      state: "cart, prices, promotions",
    },
  },
  {
    id: "ui-reactive",
    label: "Reactive UI",
    position: { x: 1060, y: 80 },
    class: "login-vue-flow__node login-vue-flow__node--ui",
    data: {
      title: "UI: render new state",
      description:
        "The page reads user, isLoggedIn, and cart data from composables instead of keeping a separate copy.",
      code: "user + isLoggedIn + cart",
      state: "reactive UI",
    },
  },
]);

const edges = ref([
  {
    id: "ui-to-composable",
    source: "ui-submit",
    target: "use-user",
    animated: true,
    label: "calls",
  },
  {
    id: "composable-to-login",
    source: "use-user",
    target: "login-api",
    animated: true,
    label: "authenticates",
  },
  {
    id: "login-to-context",
    source: "login-api",
    target: "context",
    animated: true,
    label: "then refreshes",
  },
  {
    id: "context-to-cart",
    source: "context",
    target: "cart",
    animated: true,
    label: "then reloads",
  },
  {
    id: "cart-to-ui",
    source: "cart",
    target: "ui-reactive",
    animated: true,
    label: "updates",
  },
]);

const selectedNodeId = ref(nodes.value[0].id);
const selectedNode = computed(
  () =>
    nodes.value.find((node) => node.id === selectedNodeId.value) ??
    nodes.value[0],
);

function selectNode(event: { node: (typeof nodes.value)[number] }) {
  selectedNodeId.value = event.node.id;
}
</script>

<template>
  <section class="login-vue-flow">
    <div class="login-vue-flow__canvas" aria-label="Vue Flow login diagram">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :fit-view-on-init="true"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :elements-selectable="true"
        :pan-on-drag="true"
        :zoom-on-scroll="false"
        :zoom-on-double-click="false"
        :min-zoom="0.55"
        :max-zoom="1.2"
        @node-click="selectNode"
      />
    </div>

    <!-- <aside class="login-vue-flow__panel">
      <p class="login-vue-flow__eyebrow">Vue Flow detail</p>
      <h3>{{ selectedNode.data.title }}</h3>
      <p>{{ selectedNode.data.description }}</p>
      <dl>
        <div>
          <dt>Code</dt>
          <dd>
            <code>{{ selectedNode.data.code }}</code>
          </dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>{{ selectedNode.data.state }}</dd>
        </div>
      </dl>
    </aside> -->
  </section>
</template>

<style>
.login-vue-flow .vue-flow__node.login-vue-flow__node {
  width: 170px;
  min-height: 72px;
  display: grid;
  place-items: center;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.login-vue-flow .vue-flow__node.login-vue-flow__node.selected {
  border-color: var(--vp-c-brand-1);
  box-shadow:
    0 0 0 3px var(--vp-c-brand-soft),
    0 10px 24px rgba(0, 0, 0, 0.1);
}

.login-vue-flow .login-vue-flow__node--ui {
  border-top: 4px solid #2563eb;
}

.login-vue-flow .login-vue-flow__node--composable {
  border-top: 4px solid #7c3aed;
}

.login-vue-flow .login-vue-flow__node--api {
  border-top: 4px solid #0891b2;
}

.login-vue-flow .login-vue-flow__node--context {
  border-top: 4px solid #16a34a;
}

.login-vue-flow .login-vue-flow__node--cart {
  border-top: 4px solid #ea580c;
}

.login-vue-flow .vue-flow__edge-path {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.login-vue-flow .vue-flow__edge-textbg {
  fill: var(--vp-c-bg);
}

.login-vue-flow .vue-flow__edge-text {
  fill: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
}
</style>

<style scoped>
.login-vue-flow__canvas {
  height: 360px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background:
    linear-gradient(var(--vp-c-bg-soft), var(--vp-c-bg-soft)),
    var(--vp-c-bg);
}

.login-vue-flow__panel {
  min-height: 360px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.login-vue-flow__panel h3 {
  margin: 0 0 10px;
  font-size: 20px;
}

.login-vue-flow__panel p {
  margin: 0;
}

.login-vue-flow__eyebrow {
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.login-vue-flow__panel dl {
  display: grid;
  gap: 12px;
  margin: 18px 0 0;
}

.login-vue-flow__panel dl div {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.login-vue-flow__panel dt {
  margin-bottom: 6px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.login-vue-flow__panel dd {
  margin: 0;
  font-size: 13px;
}

.login-vue-flow__panel code {
  white-space: normal;
  overflow-wrap: anywhere;
}

@media (max-width: 960px) {
  .login-vue-flow {
    grid-template-columns: 1fr;
  }

  .login-vue-flow__panel {
    min-height: 0;
  }
}
</style>
