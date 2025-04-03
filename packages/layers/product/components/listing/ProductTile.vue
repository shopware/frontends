<script
  setup
  lang="ts"
  generic="
    T extends {
      translated: {
        name: string;
      };
      calculatedCheapestPrice: {
        unitPrice: number
      }
      cover: {
        media: {
          url: string;
        };
      };
    }
  "
>
type Props = {
  product: T;
  t?: {
    productTile: {
      addToCart: string;
    };
  };
};

const {
  product,
  t = {
    productTile: {
      addToCart: "Add to cart",
    },
  },
} = defineProps<Props>();

function handleAddToCart() {
  window.dispatchEvent(
    new CustomEvent("add-to-cart", {
      detail: {
        productId: product.id,
        quantity: 1,
      },
    }),
  );
}
</script>
<template>
  
  <div>
    <img
      :src="product.cover.media.url"
      alt="Product Image"
      class=" h-80 object-cover"
    />
    <div class="p-2 flex flex-col gap-4">
      <div
        class="self-stretch justify-start text-surface-on-surface text-2xl font-normal font-['Noto_Serif'] leading-9"
      >
        {{ product.translated.name }}
      </div>
      <div class="text-surface-on-surface font-bold leading-normal">
        {{ product.calculatedCheapestPrice.unitPrice }} $
      </div>
      <BaseButton @click.prevent="handleAddToCart" class="w-full" :label="t.productTile.addToCart" />
    </div>
  </div>
</template>
