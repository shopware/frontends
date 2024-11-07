import type { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents & {
  schemas: Schemas;
};

export type Schemas = {
  // here go the entities definitions available, that can be used in operations but also imported and used standalone
};

export type operations = {
  // here go the endpoints and its definitions that can refer to the Schemas but it's not a requirement
};
