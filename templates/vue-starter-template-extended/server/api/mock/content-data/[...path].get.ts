import { defineEventHandler, getRouterParam } from "h3";
import { generateMockDataPage } from "../../../contentData";

/**
 * Mock API endpoint for /content-data/{path}
 * Returns only data and assignments (no skeleton)
 *
 * @example GET /api/mock/content-data/product/test-product
 * @example GET /api/mock/content-data/category/electronics
 */
export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path") || "product/mock-product";

  // Generate mock data
  const content = generateMockDataPage(path);

  return content;
});
