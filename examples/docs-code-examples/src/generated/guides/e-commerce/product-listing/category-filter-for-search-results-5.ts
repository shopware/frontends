import { excludeRootCategory } from "@shopware/helpers";

const { sessionContext } = useSessionContext();
const filter = {
  entities: [
    { id: "navigation-category-id", translated: { name: "Root" } },
    { id: "running-shoes-id", translated: { name: "Running shoes" } },
  ],
};

const options = computed(() =>
  excludeRootCategory(
    filter.entities,
    sessionContext.value?.salesChannel?.navigationCategoryId,
  ),
);
