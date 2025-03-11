import type { Meta, StoryObj } from "@storybook/vue3";
import Button from "../../../packages/layers/form/components/BaseButton.vue";

const meta = {
  title: "Layers/Form/BaseButton",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NuxtWelcomeStory: Story = {
  args: {},
};
