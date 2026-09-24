import { computed, ref } from "vue";

const product = ref({
  translated: {
    name: "Example product",
    description: "Example product description",
  },
  manufacturer: {
    name: "Example manufacturer",
  },
  productNumber: "SW-10001",
});

const productName = computed(() => product.value?.translated.name);
const manufacturer = computed(() => product.value?.manufacturer?.name);
const description = computed(() => product.value?.translated.description);
const productNumber = computed(() => product.value?.productNumber);
