import type { Schemas, operations } from "#shopware";

type NavigationBody =
  operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"];
type BreadcrumbResponse =
  operations["readBreadcrumb get /breadcrumb/{id}"]["response"];
type NavigationRouteResponse = Schemas["NavigationRouteResponse"];
type NavigationType = Schemas["NavigationType"];
type Category = Schemas["Category"];
type Breadcrumb = Schemas["Breadcrumb"];
type SeoUrl = Schemas["SeoUrl"];
