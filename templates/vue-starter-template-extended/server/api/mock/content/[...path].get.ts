import { defineEventHandler, getRouterParam } from "h3";
import { generateMockContentPage } from "../../../contentData";

/**
 * Mock API endpoint for /content/{path}
 * Returns fully hydrated content
 *
 * @example GET /api/mock/content/product/test-product
 * @example GET /api/mock/content/category/electronics
 * @example GET /api/mock/content/landing-page/home
 */
export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path") || "product/mock-product";

  // Generate mock content
  const content = generateMockContentPage(path);

  return content;
});
