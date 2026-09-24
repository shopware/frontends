import { ref } from "vue";

async function addToCart() {}

function useProductCustomizedProductConfigurator() {
  return {
    addToCart: async () => {},
    isActive: ref(false),
  };
}

const {
  addToCart: customizedProductAddToCart,
  isActive: isCustomizedProductActive,
} = useProductCustomizedProductConfigurator();

const addToCartProxy = async () => {
  if (isCustomizedProductActive.value) {
    await customizedProductAddToCart();
  } else {
    await addToCart();
  }
};
