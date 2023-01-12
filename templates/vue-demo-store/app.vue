<script setup lang="ts">
import { getSessionContext } from "@shopware-pwa/api-client";
import { SessionContext } from "@shopware-pwa/types";

useHead({
  title: "Shopware Demo store",
  meta: [{ name: "description", content: "Shopware Demo store" }],
  htmlAttrs: {
    lang: "en",
  },
});

const { refreshSessionContext } = useSessionContext();
onBeforeMount(async () => {
  await refreshSessionContext();
});

const { apiInstance } = useShopwareContext();
const { data: sessionContextData } = await useAsyncData(
  "sessionContext",
  async () => {
    return await getSessionContext(apiInstance);
  }
);
useSessionContext(sessionContextData.value as SessionContext);

const { getWishlistProducts } = useWishlist();
const { refreshCart } = useCart();

useNotifications();
useAddress();

onMounted(() => {
  refreshCart();
  getWishlistProducts();
});

const isSidebarOpen = ref(false);
provide("isSidebarOpen", isSidebarOpen);

const modalContent = ref<string>("");
const modalProps = ref<object | null | undefined>({});
const modalHandler = {
  open: (component: string, props?: object | null) => {
    modalContent.value = component;
    modalProps.value = props;
  },
  close: () => {
    modalContent.value = "";
    modalProps.value = {};
  },
};

provide("modal", { modalContent, modalProps, ...modalHandler });

const isSideMenuOpened = ref(false);
provide("isSideMenuOpened", isSideMenuOpened);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
h2 {
  @apply text-4xl py-4;
}

select {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIGZpbGw9J25vbmUnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBhdGggc3Ryb2tlPScjNmI3MjgwJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIHN0cm9rZS13aWR0aD0nMS41JyBkPSdNNiA4bDQgNCA0LTQnLz48L3N2Zz4=");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  appearance: none;
}
</style>
