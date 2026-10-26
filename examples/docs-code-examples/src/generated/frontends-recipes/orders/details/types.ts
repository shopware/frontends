import type { Schemas, operations } from "#shopware";

type ReadOrderBody = operations["readOrder post /order"]["body"];
type OrderRouteResponse = Schemas["OrderRouteResponse"];
type Order = Schemas["Order"];
type OrderLineItem = Schemas["OrderLineItem"];
type Document = Schemas["Document"];
type StateMachineState = Schemas["StateMachineState"];
