import type { Meta, StoryObj } from "@storybook/vue3";
import MainCounter from "../../../../../../packages/layers/layout/components/MainCounter.vue";

const meta = {
  title: "Layers/Layout/MainCounter",
  component: MainCounter,
  tags: ["autodocs"],
} satisfies Meta<typeof MainCounter>;

export default meta;

export const Primary: StoryObj<typeof MainCounter> = {
  render: (args) => ({
    components: { MainCounter },
    setup() {
      return { args };
    },
    template: '<MainCounter v-bind="args" />',
  }),
  args: {
    count: "2",
  },
};
