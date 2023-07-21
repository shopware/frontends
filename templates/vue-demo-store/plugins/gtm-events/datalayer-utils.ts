
declare global {
    interface Window {
      dataLayer: any[] | undefined;
    }
  }

const defaultCurrency = "EUR";

const initDataLayer = (): void => {
    if (process.client) {
      if (!window['dataLayer']) {
        window['dataLayer'] = [] as any[];
      }
    }
 }

const pushToDataLayer = (event: Record<string, any>) => {
  if (process.client) {
    if (!window['dataLayer']) {
      initDataLayer();
    }
    window?.dataLayer?.push( {ecommerce: null} );  // Clear the previous ecommerce object.
    window?.dataLayer?.push( event )
  }
}

// Product View event

export const logProductView = ( product: any, currency: string, quantity: number ) => {
    pushToDataLayer({  
      event: "productDetail",  
        ecommerce: {  
          items: [  
            convertProductToGTM(product, currency, quantity)  
          ]  
      }  
    })  
  }

  // product

  export const logAddToCart = (product: any, currency: string, quantity: number ) => {
    pushToDataLayer({
      event: "addToCart",
      ecommerce: {
        items: [
          convertProductToGTM(product, currency, quantity)
        ]
      }
    })
  }
  // product Remove from Cart

  export const logRemoveFromCart = (product: any, currency: string) => {
    pushToDataLayer({
      event: "removeFromCart",
      ecommerce: {
        items: [
          convertProductToGTM(product, currency, 1)
        ]
      }
    })
  }

   // Begin Checkout

  export const logBeginCheckout = ( cart: any, currency: string ) => {
    const items = cart.lineItems.map( (lineItem: any) => {
      return convertProductToGTM( lineItem, currency, lineItem.quantity );
    });
  
    pushToDataLayer({
      event: "beginCheckout",
      ecommerce: {
        items: items
      }
    })
  }


// Helper function. Convert Shopware product data structure to GTM product:

function convertProductToGTM(product: any, currency: string, quantity: number) {
    let item = {  
      item_id: product.id,  
      item_name:  product.label,  
      item_brand: product.manufacturer?.name || "",  
      price: product.price.unitPrice,  
      currency: currency || defaultCurrency,  
      quantity: quantity || product.price.quantity || 1  
    }
  
    if (currency) {  
      item['currency'] = currency;  
    }  
    return item;  
  }  
  
  

