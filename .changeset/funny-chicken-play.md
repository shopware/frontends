---
"@shopware-pwa/composables-next": minor
---

Changed `registration` method in the `useUser` composable. Because of changes in the double opt-in on registration flow in the Shopware backend we are adjusting this method on our side. In new approach we are checking `active` and `doubleOptInRegistration` properties that represents current status of the user.
