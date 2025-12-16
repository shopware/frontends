import { defineEventHandler, getRouterParam } from "h3";
import { generateMockSkeletonPage } from "../../../contentData";

/**
 * Mock API endpoint for /content-skeleton/{path}
 * Returns content skeleton without hydrated data
 *
 * @example GET /api/mock/content-skeleton/product/test-product
 * @example GET /api/mock/content-skeleton/category/electronics
 */
export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path") || "product/mock-product";

  // Generate mock skeleton
  const content = generateMockSkeletonPage(path);

  return content;
});
