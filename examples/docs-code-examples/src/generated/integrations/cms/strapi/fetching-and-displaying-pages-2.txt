import { h, resolveComponent } from "#imports";

interface StripePage {
  text: string;
  seoUrl: string;
}
export function useSWStrapi() {
  const getPage = async (route: string) => {
    const { findOne } = useStrapi();
    const response = await findOne<StripePage>("pages", undefined, {
      filters: {
        seoUrl: route,
      },
    });
    return response;
  };

  const resolveComponent = async (route: string) => {
    const page = await getPage(route);
    if (!page.data[0]) return null;
    return h("div", {}, page.data[0].attributes.text);
  };

  return {
    resolveComponent,
  };
}
