import type { Schemas, operations } from "#shopware";

type ReadOrderBody = operations["readOrder post /order"]["body"];
type GuestLookupFilter = NonNullable<ReadOrderBody["filter"]>;
type OrderRouteResponse = Schemas["OrderRouteResponse"];
type Order = Schemas["Order"];
