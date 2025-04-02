import type { Meta, StoryObj } from "@storybook/vue3";
import ListingProductTile from "../../../../../../../packages/layers/product/components/listing/ProductTile.vue";

const meta = {
  title: "Layers/Product/ListingProductTile",
  component: ListingProductTile,
  tags: ["autodocs"],
} satisfies Meta<typeof ListingProductTile>;

export default meta;

const args = {
  product: {
    translated: {
      name: "Product Name",
    },
    cover: {
      media: {
        url: "https://cdn.shopware.store/a/B/m/pPkDE/media/37/23/07/SW10085.jpg?width=1920&ts=1596695194",
      },
    },
    calculatedCheapestPrice: {
      unitPrice: 399.33,
    },
  },
};

export const Primary: StoryObj<typeof ListingProductTile> = {
  render: (args) => ({
    components: { ListingProductTile },
    setup() {
      return { args };
    },
    template: '<ListingProductTile v-bind="args" />',
  }),
  args,
};

export const List: StoryObj<typeof ListingProductTile> = {
  render: (args) => ({
    components: { ListingProductTile },
    setup() {
      return { args };
    },
    template: `
    <div class="flex flex-row gap-4">
        <ListingProductTile v-bind="args" />
        <ListingProductTile v-bind="args" />
        <ListingProductTile v-bind="args" />
    <div>
    `,
  }),
  args,
};
