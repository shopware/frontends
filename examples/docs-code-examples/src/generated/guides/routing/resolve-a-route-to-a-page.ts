import {
  useNavigationContext,
  useNavigationSearch,
  useCategorySearch,
  ref,
  useCategory,
  useLandingSearch,
  useProduct,
  useProductSearch,
} from "#imports";
import type { Schemas } from "#shopware";

const route = {
  path: "/Winter-Season/My-Product",
};
const { resolvePath } = useNavigationSearch();
const seoResult: Schemas["SeoUrl"] | null = await resolvePath(route.path);

const { routeName, foreignKey } = useNavigationContext(ref(seoResult));

const data = ref<
  Schemas["Category"] | Schemas["LandingPage"] | Schemas["Product"] | null
>(null);

switch (routeName.value) {
  case "frontend.navigation.page":
    {
      const { search: categorySearch } = useCategorySearch();
      const categoryResponse = await categorySearch(foreignKey.value, {
        withCmsAssociations: true,
      });
      const { category } = useCategory(ref(categoryResponse));
      data.value = category.value;
    }
    break;
  case "frontend.detail.page":
    {
      const { search: productSearch } = useProductSearch();
      const productResponse = await productSearch(foreignKey.value, {
        withCmsAssociations: true,
      });
      const { product } = useProduct(
        ref(productResponse.product),
        productResponse.configurator ?? [],
      );
      data.value = product.value;
    }
    break;
  case "frontend.landing.page":
    {
      const { search: landingSearch } = useLandingSearch();
      const landing = await landingSearch(foreignKey.value, {
        withCmsAssociations: true,
      });
      data.value = landing;
    }
    break;
}
