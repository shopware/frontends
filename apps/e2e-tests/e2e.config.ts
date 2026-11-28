import { defineE2eConfig } from "./utils/e2e-config";

export default defineE2eConfig({
  features: {
    wishlist: true,
    productReviews: true,
    sitemap: true,
    companyRegistration: true,
    guestCheckout: true,
  },
});
