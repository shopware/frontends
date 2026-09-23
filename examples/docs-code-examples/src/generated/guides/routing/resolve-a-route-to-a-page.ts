import type { Schemas } from "#shopware";

import {
  useNavigation,
  useNavigationContext,
  useNavigationSearch,
  useCategorySearch,
} from "@shopware/composables";

const seoResult: Schemas["SeoUrl"] | null = await resolvePath(route.path);

const { routeName, foreignKey } = useNavigationContext(ref(seoResult));

const data = ref(null);

switch (routeName.value) {
  case "frontend.navigation.page":
    let { search: categorySearch } = useCategorySearch();
    const categoryResponse = await categorySearch(foreignKey.value, {
      withCmsAssociations: true,
    });
    const { category } = useCategory(categoryResponse);
    data.value = category;
    break;
  case "frontend.detail.page":
    let { search: productSearch } = useProductSearch();
    const productResponse = await productSearch(foreignKey.value, {
      withCmsAssociations: true,
    });
    const { product } = useProduct(productResponse);
    data.value = product;
    break;
  case "frontend.landing.page":
    let { search: landingSearch } = useLandingSearch();
    const landing = await landingSearch(foreignKey.value, {
      withCmsAssociations: true,
    });
    data.value = ref(landing);
    break;
}
