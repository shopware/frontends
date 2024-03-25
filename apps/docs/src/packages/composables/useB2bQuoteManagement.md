---
category: composables
---

# useB2bQuoteManagement

<!-- PLACEHOLDER_DESCRIPTION -->

## Usage

### Get quote list

```vue{5}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const quotesList = ref([]);
    const { getQuoteList } = useB2bQuoteManagement();

    onBeforeMount(async () => {
        quotesList.value = await getQuoteList();
    });
</script>
```

### Get quote

```vue{5}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const quote = ref();
    const { getQuote } = useB2bQuoteManagement();

    onBeforeMount(async () => {
        quotesList.value = await getQuote('example-123');
    });
</script>
```

### Decline quote

```vue{5}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { declineQuote } = useB2bQuoteManagement();
    declineQuote('example-123', 'comment');
</script>
```

### Decline quote

```vue{3}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { declineQuote } = useB2bQuoteManagement();
    declineQuote('example-123', 'comment');
</script>
```

### Request change in quote

```vue{3}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { requestChangeQuote } = useB2bQuoteManagement();
    requestChangeQuote('example-123', 'comment');
</script>
```

### Request quote

```vue{3}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { requestQuote } = useB2bQuoteManagement();
    requestQuote('comment');
</script>
```

### Create order from quote

```vue{3}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { createOrderFromQuote } = useB2bQuoteManagement();
    requestQuote('example-123', 'comment');
</script>
```

### Change quote shipping method

```vue{3}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { changeShippingMethod } = useB2bQuoteManagement();
    changeShippingMethod('example-123', 'shipping-method-id');
</script>
```

### Change quote payment method

```vue{3}
<script setup lang="ts">
    import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";

    const { changePaymentMethod } = useB2bQuoteManagement();
    changePaymentMethod('example-123', 'payment-method-id');
</script>
```
