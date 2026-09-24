<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quote = ref({ id: "example-id" });
const { changeShippingMethod, changePaymentMethod } = useB2bQuoteManagement();
changeShippingMethod(quote.value.id, "example-shipping-id");
changePaymentMethod(quote.value.id, "example-payment-id");
</script>
