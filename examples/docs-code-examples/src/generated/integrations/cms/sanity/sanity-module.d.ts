declare module "sanity" {
  export function defineField<T extends Record<string, unknown>>(field: T): T;
  export function defineType<T extends Record<string, unknown>>(schema: T): T;
}
