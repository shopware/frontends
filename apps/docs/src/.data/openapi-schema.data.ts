import { defineLoader } from "vitepress";

import { createOpenApiResolver } from "./schema/openapi-resolver";
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
    const api = createOpenApiResolver({ apiType: "store" });

    return {
      summaries: summarizeOpenApiSchema(api),
    };
  },
});
