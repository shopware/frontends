declare module "#shopware" {
  export type operations = import("@shopware/api-client/store-api-types").operations;

  export type Schemas =
    import("@shopware/api-client/store-api-types").components["schemas"];
}
