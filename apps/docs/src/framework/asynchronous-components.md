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
