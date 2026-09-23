<script setup lang="ts">
import { ref } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
const quote = ref("example-id");
const { changeShippingMethod, changePaymentMethod } = useB2bQuoteManagement();
changeShippingMethod(quote.value.id, "example-shipping-id");
changePaymentMethod(quote.value.id, "example-payment-id");
</script>
