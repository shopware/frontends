import type { App } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { registerCmsComponents } from "../registerCmsComponents";

// This file is the Vue app entrypoint that runs on every page
// It sets up Vue Router and registers CMS components globally
export default (app: App) => {
  // Create a basic Vue Router instance
  // This is needed because some cms-base-layer components use useRouter/useRoute
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: { template: "<div></div>" },
      },
    ],
  });

  app.use(router);

  // Register all CMS components globally
  // This is required for CmsPage to resolve section/block/element components dynamically
  registerCmsComponents(app);
};
