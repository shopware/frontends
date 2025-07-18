<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "OrderHistory",
});
definePageMeta({
  layout: "account",
});

const {
  orders,
  loadOrders,
  changeCurrentPage,
  totalPages,
  currentPage,
  limit,
} = useCustomerOrders();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const defaultLimit = 15;
const defaultPage = 1;

type Translations = {
  account: {
    noOrders: string;
    perPage: string;
    order: {
      order: string;
      orders: string;
    };
  };
};
const translations: Translations = {
  account: {
    noOrders: "No orders found 😔",
    perPage: "Per Page:",
    order: {
      order: "Order",
      orders: "Orders",
    },
  },
};

useBreadcrumbs([
  {
    name: t("breadcrumbs.accountOverview"),
    path: "/account",
  },
  {
    name: t("breadcrumbs.order"),
    path: "/account/order",
  },
]);

limit.value = route.query.limit ? Number(route.query.limit) : defaultLimit;

const changeLimit = async (ev: Event) => {
  const select = ev.target as HTMLSelectElement;
  limit.value = +select.value;

  await router.push({
    query: {
      ...route.query,
      p: defaultPage,
      limit: select.value,
    },
  });
  if (route.query.p) {
    changeCurrentPage(+route.query.p);
  }
};

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
    },
  });
  await changeCurrentPage(page);
};

await useAsyncData("getOrders", () => {
  return loadOrders({
    limit: limit.value,
    page: route.query.p ? Number(route.query.p) : defaultPage,
    checkPromotion: true, // determines whether "paymentChangeable" list is available in the response
    associations: {
      stateMachineState: {},
    },
    sort: [
      {
        field: "createdAt",
        order: "DESC",
      },
    ],
  });
});
</script>

<template>
  <div class="container mx-auto my-8">
    <h1 class="border-b pb-3 text-2xl font-medium text-secondary-900 mb-8">
      {{ $t("account.orderHistoryHeader") }}
    </h1>
    <AccountOrder v-for="order in orders" :key="order.id" :order="order" />
    <div v-if="orders.length === 0" class="text-center text-secondary-600">
      {{ translations.account.noOrders }}
    </div>
    <div
      class="grid grid-cols-1 lg:flex lg:justify-center lg- gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
    >
      <div class="text-center place-self-center">
        <SharedPagination
          :total="totalPages"
          :current="Number(currentPage)"
          @change-page="changePage"
        />
      </div>
      <div class="text-center place-self-center mt-2 lg:mt-0">
        <div
          class="inline-block align-top text-center md:text-left"
          data-testid="order-pagination-limit-box"
        >
          <label
            for="limit"
            class="inline mr-4"
            data-testid="order-pagination-limit-label"
            >{{ translations.account.perPage }}</label
          >
          <select
            id="limit"
            v-model="limit"
            name="limitchoices"
            class="inline appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            data-testid="order-pagination-limit-select"
            @change="changeLimit"
          >
            <option :value="1">1 {{ translations.account.order.order }}</option>
            <option :value="15">
              15 {{ translations.account.order.orders }}
            </option>
            <option :value="30">
              30 {{ translations.account.order.orders }}
            </option>
            <option :value="45">
              45 {{ translations.account.order.orders }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
