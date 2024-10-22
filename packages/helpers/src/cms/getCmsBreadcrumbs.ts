/**
 * Build the breadcrumbs for the CMS page
 *
 * @param page
 * @returns
 */
export function getCmsBreadcrumbs<
  T extends {
    translated: {
      name: string;
    };
  },
>(page: T): { name: string }[] {
  return [
    {
      name: page.translated.name,
    },
  ];
}
