import type { Meta, StoryObj } from "@storybook/vue3";
import IconButton from "../../../../../../packages/layers/form/components/IconButton.vue";

const meta = {
  title: "Layers/Form/IconButton",
  component: IconButton,
  tags: ["autodocs"],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args };
    },
    template:
      '<IconButton v-bind="args"> <i class="w-full h-full i-carbon-favorite block" /> </IconButton>',
  }),
  args: {
    type: "primary",
    disabled: false,
  },
};
