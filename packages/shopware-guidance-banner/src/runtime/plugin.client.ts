import { createApp, h } from 'vue'
import { defineNuxtPlugin } from '#app'
import ShopwareBanner from './components/ShopwareBanner.vue'

export default defineNuxtPlugin(() => {
  const containerId = 'shopware-guidance-banner-root'

  if (document.getElementById(containerId)) {
    return
  }

  const container = document.createElement('div')
  container.id = containerId
  document.body.appendChild(container)

  const app = createApp({
    render: () => h(ShopwareBanner),
  })

  app.mount(container)
})
