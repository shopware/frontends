import { defineEventHandler, getRouterParam } from "h3";
import { generateMockDecomposedPage } from "../../../contentData";

/**
 * Mock API endpoint for /content-decomposed/{path}
 * Returns content with skeletons, deduplicated data, and assignments
 *
 * @example GET /api/mock/content-decomposed/product/test-product
 * @example GET /api/mock/content-decomposed/category/electronics
 */
export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path") || "product/mock-product";

  // Generate mock decomposed content
  const content = generateMockDecomposedPage(path);

  return content;
});
