<script setup lang="ts">
import type { operations } from "#shopware";

const {
  orders,
  loadOrders,
  changeCurrentPage,
  currentPage,
  totalPages,
  limit,
} = useCustomerOrders();
const { isLoggedIn } = useUser();

// browserLocale is the visitor's locale (navigator.language, or accept-language
// during SSR), not the storefront's. usePrice formats in that locale too, but
// takes the currency from the session context. Both beat the host default,
// which differs between the server render and the browser.
const { browserLocale } = useShopwareContext();
const { getFormattedPrice } = usePrice();
const localePath = (path: string) => path;
const { formatLink } = useInternationalization(localePath);

// loadOrders replaces the limit in your criteria with this ref, so set it here.
limit.value = 10;

// The list carries no associations by default: without stateMachineState the
// rows have no order state, even though the generated type declares one.
const criteria: operations["readOrder post /order"]["body"] = {
  associations: {
    stateMachineState: {},
  },
  sort: [{ field: "createdAt", order: "DESC" }],
};

// Starts false: the immediate watcher below runs synchronously in setup and
// flips it before the first render, so a signed-out visitor is never "busy".
const isLoading = ref(false);
const ordersError = ref("");

const loadFirstPage = async () => {
  ordersError.value = "";
  isLoading.value = true;

  try {
    await loadOrders({ ...criteria, page: 1 });
  } catch {
    ordersError.value = "Your orders could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

// changeCurrentPage re-sends the criteria of the last loadOrders call with a
// new page, so the associations and the sorting above are kept.
// The in-flight guard is what makes aria-disabled safe: the buttons stay
// mounted and focusable, so the click has to be rejected here instead.
const changePage = async (page: number) => {
  if (isLoading.value || page < 1) return;
  // totalPages is 0 until a load succeeds, so the upper bound only applies
  // once there is data — otherwise the retry button could never fire.
  if (totalPages.value && page > totalPages.value) return;

  ordersError.value = "";
  isLoading.value = true;

  try {
    await changeCurrentPage(page);
  } catch {
    ordersError.value = "Your orders could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(browserLocale).format(new Date(value));

// One live region for the page position and the loading state, so a page
// change is announced instead of silently swapping the list underneath.
const statusMessage = computed(() => {
  if (isLoading.value) return "Loading orders…";
  if (!orders.value.length) return "";
  return `Page ${currentPage.value} of ${totalPages.value}`;
});

// Immediate watcher instead of onMounted: the orders belong to the customer
// behind the context token, so the list is reloaded when the session changes.
watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      loadFirstPage();
    }
  },
  { immediate: true },
);
</script>

<template>
  <section :aria-busy="isLoading">
    <h1>Order history</h1>

    <p v-if="!isLoggedIn">Sign in to see your orders.</p>

    <template v-else>
      <p role="status">{{ statusMessage }}</p>

      <!-- role="alert" and a retry, not a replacement for the list: the
           previous page is still in `orders` and still worth showing. -->
      <div v-if="ordersError" role="alert">
        <p>{{ ordersError }}</p>
        <button type="button" @click="changePage(currentPage)">
          Try again
        </button>
      </div>

      <p v-else-if="!isLoading && !orders.length">
        You have not placed an order yet.
      </p>

      <ul v-if="orders.length">
        <li v-for="order in orders" :key="order.id">
          <!-- NuxtLink, not <a href>: a plain anchor is a full document
               navigation, and formatLink keeps the active locale prefix. -->
          <NuxtLink :to="formatLink(`/account/order/details/${order.id}`)">
            Order {{ order.orderNumber }}
          </NuxtLink>
          <time :datetime="order.orderDate">
            {{ formatDate(order.orderDate) }}
          </time>
          <span>{{ getFormattedPrice(order.amountTotal) }}</span>
          <span v-if="order.stateMachineState">
            {{ order.stateMachineState.translated.name }}
          </span>
        </li>
      </ul>

      <!-- Always mounted and aria-disabled rather than removed or disabled:
           unmounting the control the customer just activated drops focus to
           the document body. changePage() guards the click. -->
      <nav aria-label="Order history pages">
        <button
          type="button"
          :aria-disabled="isLoading || currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          Previous page
        </button>

        <button
          type="button"
          :aria-disabled="isLoading || currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next page
        </button>
      </nav>
    </template>
  </section>
</template>
