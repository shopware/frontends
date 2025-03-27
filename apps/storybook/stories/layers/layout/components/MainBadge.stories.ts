import type { Meta, StoryObj } from "@storybook/vue3";
import MainBadge from "../../../../../../packages/layers/layout/components/MainBadge.vue";

const meta = {
  title: "Layers/Layout/MainBadge",
  component: MainBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof MainBadge>;

export default meta;

export const Primary: StoryObj<typeof MainBadge> = {
  render: (args) => ({
    components: { MainBadge },
    setup() {
      return { args };
    },
    template: '<MainBadge v-bind="args" />',
  }),
  args: {
    label: "Badge",
    type: "info",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
};
