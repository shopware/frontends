import type { Meta, StoryObj } from "@storybook/vue3";
import LayoutBreadcrumbs from "../../../../../../packages/layers/layout/components/LayoutBreadcrumbs.vue";
import LayoutBreadcrumbsDivider from "../../../../../../packages/layers/layout/components/LayoutBreadcrumbsDivider.vue";
import LayoutBreadcrumbsElement from "../../../../../../packages/layers/layout/components/LayoutBreadcrumbsElement.vue";

const meta = {
  title: "Layers/Layout/LayoutBreadcrumbs",
  component: LayoutBreadcrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof LayoutBreadcrumbs>;

export default meta;

export const Primary: StoryObj<typeof LayoutBreadcrumbs> = {
  render: (args) => ({
    components: { LayoutBreadcrumbs },
    setup() {
      return { args };
    },
    template: '<LayoutBreadcrumbs v-bind="args" />',
  }),
  args: {
    breadcrumbs: [
      {
        name: "Home",
        path: "/99",
      },
      {
        name: "Pmage",
        path: "/page",
      },
      {
        name: "Current0000",
        path: "/page/current",
      },
    ],
  },
};

export const Divider: StoryObj<typeof LayoutBreadcrumbsDivider> = {
  render: (args) => ({
    components: { LayoutBreadcrumbsDivider },
    setup() {
      return { args };
    },
    template: "<LayoutBreadcrumbsDivider  />",
  }),
  args: {},
};

export const Element: StoryObj<typeof LayoutBreadcrumbsElement> = {
  render: (args) => ({
    components: { LayoutBreadcrumbsElement },
    setup() {
      return { args };
    },
    template: `<LayoutBreadcrumbsElement v-bind="args"  />`,
  }),
  args: {
    label: "Label",
  },
};
