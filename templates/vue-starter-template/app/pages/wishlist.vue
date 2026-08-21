<script setup lang="ts">
import type { OffsetPaginationFetcher } from "#imports";
import type { Schemas } from "#shopware";

const route = useRoute();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const { isLoggedIn } = useUser();
const { apiClient } = useShopwareContext();

const list = ref<{ refresh: () => unknown } | null>(null);

const fetchWishlistProducts: OffsetPaginationFetcher<
  Schemas["Product"]
> = async ({ page, limit }) => {
  const { data } = await apiClient.invoke(
    "readCustomerWishlist post /customer/wishlist",
    {
      body: {
        page,
        limit,
        "total-count-mode": "exact",
      },
    },
  );

  return {
    elements: data.products.elements ?? [],
    total: data.products.total ?? 0,
  };
};
</script>

<template>
  <div class="container mx-auto mb-10 px-6 sm:px-0">
    <template v-if="isLoggedIn">
      <AccountPageHeader
        class="mb-14"
        :title="$t('wishlist.header')"
        :subtitle="$t('wishlist.subHeader')"
      />

      <SharedPaginatedList
        ref="list"
        :fetcher="fetchWishlistProducts"
        data-key="wishlist-products"
      >
        <template #default="{ items }: { items: Schemas['Product'][] }">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <WishlistProductTile
              v-for="product in items"
              :key="product.id"
              :product
              @removed="list?.refresh()"
            />
          </div>
        </template>

        <template #loading="{ limit }">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <WishlistProductTileSkeleton v-for="n in limit" :key="n" />
          </div>
        </template>

        <template #empty>
          <div
            class="flex flex-col items-center justify-center py-20 px-6 text-center"
          >
            <AccountPageHeader
              class="mb-6"
              :title="$t('wishlist.empty.title')"
              :subtitle="$t('wishlist.empty.description')"
            />
            <NuxtLink
              :to="formatLink('/')"
              class="px-4 py-3 rounded bg-brand-primary text-brand-on-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-primary-hover transition-colors"
            >
              {{ $t("wishlist.empty.continueShopping") }}
            </NuxtLink>
          </div>
        </template>
      </SharedPaginatedList>
    </template>
    <template v-else>
      <div
        class="flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <AccountPageHeader
          class="mb-6"
          :title="$t('wishlist.notLoggedIn.title')"
          :subtitle="$t('wishlist.notLoggedIn.description')"
        />
        <div
          class="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6"
        >
          <NuxtLink
            :to="`${formatLink('/account/login')}?redirect=${encodeURIComponent(route.fullPath)}`"
            class="px-4 py-3 rounded bg-brand-primary text-brand-on-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-primary-hover transition-colors"
          >
            {{ $t("wishlist.notLoggedIn.login") }}
          </NuxtLink>
          <NuxtLink
            :to="`${formatLink('/account/login')}?redirect=${encodeURIComponent(route.fullPath)}#registration`"
            class="px-4 py-3 rounded bg-brand-secondary text-brand-on-secondary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-brand-secondary-hover transition-colors"
          >
            {{ $t("wishlist.notLoggedIn.register") }}
          </NuxtLink>
          <span class="text-surface-on-surface">or</span>
          <NuxtLink
            :to="formatLink('/')"
            class="px-4 py-3 rounded bg-transparent border-1 border-brand-primary text-brand-primary text-base font-bold leading-normal inline-flex justify-center items-center gap-1 hover:bg-surface-surface-container transition-colors"
          >
            {{ $t("wishlist.notLoggedIn.continueShopping") }}
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
