<script setup lang="ts">
import { computed, ref } from "vue";
import SchemaTypeTooltip from "./SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Submit credentials",
    detail:
      "The login form collects username and password, then calls the composable. The component owns loading and form error state only.",
    code: "submit() -> login(credentials)",
    state: "local form state",
    typeKeys: ["LoginBody"],
  },
  {
    title: "Composable",
    action: "Run login workflow",
    detail:
      "useUser owns the Shopware-specific workflow. It sends credentials first, then refreshes context and cart data.",
    code: "useUser().login(credentials)",
    state: "customer workflow",
    typeKeys: ["LoginBody", "ContextTokenResponse"],
  },
  {
    title: "Store API",
    action: "Authenticate customer",
    detail:
      "The API client invokes the generated operation for POST /account/login. This step validates credentials.",
    code: 'apiClient.invoke("loginCustomer post /account/login")',
    state: "sw-context-token",
    typeKeys: ["LoginBody", "ContextTokenResponse", "ApiError"],
  },
  {
    title: "Context",
    action: "Refresh session",
    detail:
      "The session context is fetched again so customer, customer group, currency, rules, and other context-dependent values are current.",
    code: 'apiClient.invoke("readContext get /context")',
    state: "user, isLoggedIn, sales channel context",
    typeKeys: ["SalesChannelContext", "Customer"],
  },
  {
    title: "Cart",
    action: "Reload cart",
    detail:
      "The cart is refreshed because prices, promotions, and line items can depend on the authenticated customer context.",
    code: "refreshCart()",
    state: "cart, prices, promotions",
    typeKeys: ["Cart"],
  },
  {
    title: "UI",
    action: "Render new state",
    detail:
      "The UI reads user, isLoggedIn, and cart data from composables instead of keeping its own copy.",
    code: "user + isLoggedIn + cart",
    state: "reactive UI",
    typeKeys: ["Customer", "Cart"],
  },
];

const activeStepIndex = ref(0);
const activeStep = computed(() => steps[activeStepIndex.value]);
</script>

<template>
  <section class="login-flow" aria-label="Login flow diagram">
    <div class="login-flow__track">
      <button
        v-for="(step, index) in steps"
        :key="`${step.title}-${index}`"
        type="button"
        class="login-flow__step"
        :class="{ 'login-flow__step--active': activeStepIndex === index }"
        :aria-pressed="activeStepIndex === index"
        @click="activeStepIndex = index"
      >
        <span class="login-flow__number">{{ index + 1 }}</span>
        <span class="login-flow__title">{{ step.title }}</span>
        <span class="login-flow__action">{{ step.action }}</span>
      </button>
    </div>

    <div class="login-flow__details">
      <div>
        <p class="login-flow__eyebrow">Step {{ activeStepIndex + 1 }}</p>
        <h3>{{ activeStep.title }}: {{ activeStep.action }}</h3>
        <p>{{ activeStep.detail }}</p>
      </div>

      <dl class="login-flow__facts">
        <div>
          <dt>Code</dt>
          <dd>
            <code>{{ activeStep.code }}</code>
          </dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>{{ activeStep.state }}</dd>
        </div>
        <div>
          <dt>Types</dt>
          <dd class="login-flow__types">
            <SchemaTypeTooltip
              v-for="typeKey in activeStep.typeKeys"
              :key="typeKey"
              :type-key="typeKey"
            />
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.login-flow {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: visible;
  background: var(--vp-c-bg-soft);
}

.login-flow__track {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  border-bottom: 1px solid var(--vp-c-divider);
}

.login-flow__step {
  min-height: 128px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 8px;
  align-content: start;
  padding: 16px 12px;
  border: 0;
  border-right: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  text-align: left;
  cursor: pointer;
}

.login-flow__step:last-child {
  border-right: 0;
}

.login-flow__step:hover,
.login-flow__step:focus-visible {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.login-flow__step:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.login-flow__step--active {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: inset 0 -3px 0 var(--vp-c-brand-1);
}

.login-flow__number {
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-weight: 700;
  font-size: 13px;
}

.login-flow__step--active .login-flow__number {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.login-flow__title {
  font-weight: 700;
  font-size: 14px;
}

.login-flow__action {
  font-size: 13px;
  line-height: 1.4;
}

.login-flow__details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.6fr);
  gap: 24px;
  padding: 24px;
  background: var(--vp-c-bg);
}

.login-flow__details h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.login-flow__details p {
  margin: 0;
}

.login-flow__eyebrow {
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.login-flow__facts {
  display: grid;
  gap: 12px;
  margin: 0;
}

.login-flow__facts div {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.login-flow__facts dt {
  margin-bottom: 6px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.login-flow__facts dd {
  margin: 0;
  font-size: 13px;
}

.login-flow__facts code {
  white-space: normal;
  overflow-wrap: anywhere;
}

.login-flow__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 960px) {
  .login-flow__track {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .login-flow__step:nth-child(3) {
    border-right: 0;
  }

  .login-flow__step:nth-child(n + 4) {
    border-top: 1px solid var(--vp-c-divider);
  }
}

@media (max-width: 640px) {
  .login-flow__track,
  .login-flow__details {
    grid-template-columns: 1fr;
  }

  .login-flow__step {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .login-flow__step:nth-child(n + 4) {
    border-top: 0;
  }

  .login-flow__details {
    padding: 18px;
  }
}
</style>
