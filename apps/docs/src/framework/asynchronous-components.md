---
head:
  - - meta
    - name: og:title
      content: Asynchronous Components
  - - meta
    - name: og:description
      content: "How to deal with asynchronicity in components"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/**Async**%20Components?fontSize=150px"
---

# Asynchronous Components

In order to fetch components or data asynchronously and display placeholders while the content is loading, we recommend using Vue 3's `Suspense` component

```vue-html
<Suspense>
  <!-- component with nested async dependencies -->
  <PaymentMethods />

  <!-- loading state via #fallback slot -->
  <template #fallback>
    <div class="loading">
        <PaymentMethodsSkeleton />
    </div>
  </template>
</Suspense>
```

TODO: Add example
