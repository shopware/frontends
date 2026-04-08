# Braintree Credit Card - Headless Integration Example

This example demonstrates headless integration with the [Shopware Braintree App](https://github.com/shopware/braintree-app).

## How It Works

The integration uses Shopware's App System to authenticate requests to the Braintree app server.

### Authentication Flow

1. **Get app token** from Shopware Store-API:
   ```
   POST /store-api/app-system/SwagBraintreeApp/generate-token
   ```
   Returns `{ token, shopId }`

2. **Get Braintree client config** from the Braintree app:
   ```
   POST https://braintree.shopware.com/api/client/config?shop-id=...&currency-id=...&sales-channel-id=...
   ```
   Headers (important!):
   - `shopware-app-token: <token>` (NOT `Authorization: Bearer`)
   - `shopware-app-shop-id: <shopId>`

   Returns `{ clientToken, threeDSecure: { enabled, ... } }`

### Payment Flow

1. Initialize Braintree Drop-in with the `clientToken`
2. User enters card details
3. Call `requestPaymentMethod()` to get `nonce` and `deviceData`
4. Create order via Store-API (`POST /store-api/checkout/order`)
5. Handle payment with Braintree data:
   ```
   POST /store-api/handle-payment
   {
     orderId: "...",
     finishUrl: "...",
     errorUrl: "...",
     braintreeNonce: "<nonce>",
     braintreeDeviceData: "<deviceData>"
   }
   ```

**Important:** The `braintreeNonce` and `braintreeDeviceData` must be passed to `/handle-payment`, not to `/checkout/order`.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Update `nuxt.config.ts` with your:
   - Shopware endpoint (must have Braintree app installed and configured)
   - Store-API access token
   - Test customer credentials

3. Run the dev server:
   ```bash
   pnpm dev
   ```

## Prerequisites

- Shopware 6 instance with the Braintree App installed
- Braintree payment method enabled and configured
- A customer account with a valid address (required for checkout)

## Test Card Numbers

For Braintree sandbox testing:
- Visa: `4111 1111 1111 1111`
- Any future expiration date
- Any 3-digit CVV

## Files

- `app/app.vue` - Main checkout flow with order creation
- `app/components/BraintreeCreditCard.vue` - Braintree Drop-in integration
- `nuxt.config.ts` - Configuration

## Key Implementation Details

### Correct Headers for Braintree App API

The Braintree app expects specific headers (matching the [storefront SDK](https://github.com/FriendsOfShopware/shopware-storefront-sdk)):

```javascript
headers: {
  "shopware-app-token": token,      // The JWT from generate-token
  "shopware-app-shop-id": shopId    // The shop ID
}
```

Do NOT use `Authorization: Bearer` - this will result in 500 errors.

### Enable dataCollector for deviceData

```javascript
dropin.create({
  authorization: clientToken,
  container: "#container",
  dataCollector: true  // Required for fraud detection
});
```

## Resources

- [Braintree App Wiki - Headless Integration](https://github.com/shopware/braintree-app/wiki/3.-Headless-integration)
- [Braintree Web Drop-in](https://github.com/braintree/braintree-web-drop-in)
- [Shopware Braintree App](https://github.com/shopware/braintree-app)
- [FriendsOfShopware Storefront SDK](https://github.com/FriendsOfShopware/shopware-storefront-sdk)
