import type { Meta, StoryObj } from "@storybook/vue3";
import QuantitySelect from "../../../../../../packages/layers/form/components/QuantitySelect.vue";

const meta = {
  title: "Layers/Form/QuantitySelect",
  component: QuantitySelect,
  tags: ["autodocs"],
} satisfies Meta<typeof QuantitySelect>;

export default meta;
type Story = StoryObj<typeof QuantitySelect>;

export const Primary: Story = {
  render: (args) => ({
    components: { QuantitySelect },
    setup() {
      const quantity = ref(1);
      return { args, quantity };
    },
    template: '<QuantitySelect v-bind="args" v-model="quantity" />',
  }),
  //   args: {
  //     type: "primary",
  //     disabled: false,
  //   },
};
