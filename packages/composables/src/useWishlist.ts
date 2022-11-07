import {
  ref,
  Ref,
  computed,
  onMounted,
  inject,
  provide,
  ComputedRef,
} from "vue";

export type UseWishlistReturn = {
  addToWishlist: (id: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  items: ComputedRef<string[]>;
  count: ComputedRef<number>;
};

/**
 * Composable for wishlist management. Options - {@link UseWishlistReturn}
 */
export function useWishlist(): UseWishlistReturn {
  const _wishlistItems: Ref<string[]> = inject("swWishlistItems", ref([]));
  provide("swWishlistItems", _wishlistItems);

  // update wishlist in localstorage
  const updateStorage = (): void => {
    localStorage.setItem(
      "sw-wishlist-items",
      JSON.stringify(_wishlistItems.value)
    );
  };
  /* istanbul ignore next */
  const getFromStorage = () => {
    if (typeof window != "undefined" && localStorage) {
      return JSON.parse(localStorage.getItem("sw-wishlist-items") ?? "[]");
    }
  };
  /* istanbul ignore next */
  onMounted(() => {
    if (!_wishlistItems.value?.length) {
      try {
        const currentWishlist = getFromStorage();
        if (Array.isArray(currentWishlist) && currentWishlist.length) {
          _wishlistItems.value = currentWishlist || [];
        }
      } catch (error) {
        console.error("useWishlist:getFromStorage", error);
      }
    }
  });

  // removes item from the list
  async function removeFromWishlist(id: string) {
    if (!id) {
      return;
    }

    _wishlistItems.value =
      _wishlistItems.value?.filter((itemId: string) => itemId != id) || [];

    updateStorage();
  }

  // add product id to wishlist array and trigger to update localstorage
  async function addToWishlist(id: string) {
    if (!id) {
      return;
    }
    _wishlistItems.value = _wishlistItems.value || [];

    if (!_wishlistItems.value.includes(id)) {
      _wishlistItems.value.push(id);

      updateStorage();
      // broadcast(INTERCEPTOR_KEYS.ADD_TO_WISHLIST, {
      //   product,
      // });
    }
  }

  // remove all items from wishlist
  async function clearWishlist() {
    _wishlistItems.value = [];
    updateStorage();
  }

  const items = computed(() => _wishlistItems.value || []);
  const count = computed(() => items.value.length);

  return {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    items,
    count,
  };
}
