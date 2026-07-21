import { defineLoader } from "vitepress";

import { createOpenApiReader } from "./schema/openapi-reader";
import {
  summarizeOpenApiSchema,
  type SchemaSummary,
} from "./schema/schema-summary";

export interface Data {
  summaries: Record<string, SchemaSummary>;
}

declare const data: Data;
export { data };

export default defineLoader({
  load(): Data {
    const api = createOpenApiReader({ apiType: "store" });

    return {
      summaries: summarizeOpenApiSchema(api),
    };
  },
});
