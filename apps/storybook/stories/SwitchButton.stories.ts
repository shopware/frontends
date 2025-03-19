import type { Meta, StoryObj } from "@storybook/vue3";
import SwitchButton from "../../../packages/layers/form/components/SwitchButton.vue";

const meta = {
  title: "Layers/Form/SwitchButton",
  component: SwitchButton,
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchButton>;

export default meta;
type Story = StoryObj<typeof SwitchButton>;

export const Primary: Story = {
  render: (args) => ({
    components: { SwitchButton },
    setup() {
      return { args };
    },
    template: '<SwitchButton v-bind="args" />',
  }),
  args: {
    disabled: false,
    focused: false,
    checked: true,
  },
};
