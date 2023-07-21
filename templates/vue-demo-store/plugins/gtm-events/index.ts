import { debounce } from "@shopware-pwa/helpers";
import { 
  logAddToCart, 
  logRemoveFromCart,
  logBeginCheckout 
} from "./datalayer-utils";

export default defineNuxtPlugin((nuxtApp: any) => {

 
  let pluginInitialized = false;
  let currency: string = 'EUR';

  nuxtApp.hook('app:suspense:resolve',  () => {  

  
    const { cart } = useCart();

    let lineItemQuantityMap = new Map<string, number>()
    // Watch for changes to the cart

    const trackAddToCart = debounce((newItem: any, qty: any) => {
      logAddToCart(newItem, currency, qty)
    }, 300)

    const trackRemoveFromCart = debounce((removedItem: any) => {
      logRemoveFromCart(removedItem, currency)
    }, 300)

    watch(
      () => cart.value?.lineItems,
      (newItems, oldItems) => {
        newItems?.forEach((newItem) => {
          // Check if a line item was added to the cart
          const oldQuantity = lineItemQuantityMap.get(newItem.id) ?? 0

          if (
            !oldItems?.some((oldItem) => oldItem.id === newItem.id) ||
            oldQuantity < newItem.quantity
          ) {
            // A line item was added to the cart
            let qty = 1
            if(oldQuantity < newItem.quantity) {
              qty = newItem.quantity - oldQuantity
            }
            if(pluginInitialized) {
              trackAddToCart(newItem, qty)
            }
          }

          // Update the line item quantity map
          lineItemQuantityMap.set(newItem.id, newItem.quantity);
        });
        
        // Check for removed items
        oldItems?.forEach((oldItem) => {
          if (!newItems?.some((newItem) => newItem.id === oldItem.id)) {
            trackRemoveFromCart(oldItem)
          }
        });
        pluginInitialized = true
      },
      { deep: true }
    );
    
    nuxtApp.$router.afterEach((to: any) => {
      // log begin checkout
      if(to.fullPath == '/checkout') { 
        logBeginCheckout(cart.value, currency)  
      }      
     })
  })
})