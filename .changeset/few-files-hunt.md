---
"vite-vue-plugin-disable-inputs": minor
---

DEPRECATION - this package is deprecated and no longer maintained.

Using [expect.toPass](https://playwright.dev/docs/test-assertions#expecttopass) seems to be a better, and less invasive solution in order to achieve the same goal. Even though an app is not mounted, `toPass` assertion will retry the same test block, reflecting more human behavior, when for instance, some button is not active, an user will try to click it twice.
