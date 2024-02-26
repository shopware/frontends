---
"vue-demo-store": patch
"@shopware-pwa/nuxt3-module": patch
---

Changed usage of env variables to be able to adjust their naming to only include shopware once.
After merging, ENV Variables with names including _*SHOPWARE_SHOPWARE*_ still work.
