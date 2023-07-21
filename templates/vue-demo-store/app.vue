<script setup lang="ts">
import { getSessionContext } from "@shopware-pwa/api-client";
import { SessionContext } from "@shopware-pwa/types";
/**
 * Init breadcrumbs context
 */
useBreadcrumbs();
const route = useRoute();
const { apiInstance } = useShopwareContext();
useHead({
  title: "Shopware Demo store",
  meta: [{ name: "description", content: "Shopware Demo store" }],
  htmlAttrs: {
    lang: "en",
  },
});
const { locale } = useI18n({ useScope: 'global' });
const { data: sessionContextData } = await useAsyncData(
  "sessionContext",
  async () => {
    return await getSessionContext(apiInstance);
  }
);
const { sessionContext, refreshSessionContext } = useSessionContext(sessionContextData.value as SessionContext);
const { fetchLang, currentLanguage, syncLanguageData } = useLanguage();
const { fetchAvailableCurrencies } = useCurrency();

await useAsyncData(
  "fetchLang",
  async () => {
    return await fetchLang();
  }
);
await useAsyncData(
  "fetchAvailableCurrencies",
  async () => {
    return await fetchAvailableCurrencies();
  }
);

// Navigation for default theme
const { loadNavigationElements } = useNavigation();

const { data } = useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});

const { loadNavigationElements: loadFooterNavigationElements } = useNavigation({
  type: "footer-navigation",
});
const { data: footerData } = useAsyncData("mainFooterNavigation", () => {
  return loadFooterNavigationElements({ depth: 2 });
});

provide("swNavigation-main-navigation", data);
provide("swNavigation-footer-navigation", footerData);

const { getWishlistProducts } = useWishlist();
const { refreshCart } = useCart();

useNotifications();
useAddress();

onBeforeMount(async () => {
  await refreshSessionContext();
  syncLanguageData(sessionContext.value?.salesChannel?.languageId!);
  locale.value = currentLanguage.value?.translationCode?.code || '';
  const [ dataTemp, footerDataTemp ]: any = await Promise.all([
    loadNavigationElements({ depth: 2 }),
    loadFooterNavigationElements({ depth: 2 })
  ]);
  data.value = dataTemp;
  footerData.value = footerDataTemp;
});

const path = computed(() => route.path || '');

const isSidebarOpen = ref(false);
provide("isSidebarOpen", isSidebarOpen);

const modalContent = ref<string>("");
const modalProps = ref<{
  position?: string
} | null | undefined>({});
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

const headerMode = useState<'default' | 'transparent'>('headerMode', () => 'transparent');
const showBreadCrumb = useState<boolean>('showBreadCrumb');

const scrollPos = ref(0);

const handleScroll = () => {
  if (path.value === '/') {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      headerMode.value = 'default';
    } else {
      headerMode.value = 'transparent';
    }
  }

  let windowY = window.scrollY;
  if (Math.abs(windowY - scrollPos.value) > 100) {
    if (windowY < scrollPos.value) {
      // Scrolling UP
      document.body.classList.add('scrolling-up');
      document.body.classList.remove('scrolling-down');
    } else {
      // Scrolling DOWN
      document.body.classList.add('scrolling-down');
      document.body.classList.remove('scrolling-up');
    }
    scrollPos.value = windowY;
  }
}

const controlState = () => {
  if (path.value === '/') {
    showBreadCrumb.value = false;
    headerMode.value = 'transparent';
  } else {
    showBreadCrumb.value = true;
    headerMode.value = 'default';
  }
}

watch(path, () => {
  controlState();
});

onMounted(() => {
  refreshCart();
  getWishlistProducts();
  controlState();
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  font-family: 'Inter', sans-serif;
  @apply text-gray-900;
}

h2 {
  @apply text-4xl;
}
h3 {
  @apply text-2xl md:text-3xl;
}
h4 {
  @apply text-2xl;
}
h5 {
  @apply text-xl;
}
h6 {
  @apply text-lg font-medium;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px #F1F2F3; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #8D8F9A; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #8D8F9A; 
}
input[type='checkbox']:checked {
  background-color: currentColor;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  border: none;
}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
