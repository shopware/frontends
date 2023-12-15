import { z } from "zod";

const productSchema = z.object({
  id: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  versionId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  parentId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  parentVersionId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  manufacturerId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  productManufacturerVersionId: z
    .string()
    .regex(new RegExp("^[0-9a-f]{32}$"))
    .optional(),
  unitId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  taxId: z.string().regex(new RegExp("^[0-9a-f]{32}$")),
  coverId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  productMediaVersionId: z
    .string()
    .regex(new RegExp("^[0-9a-f]{32}$"))
    .optional(),
  deliveryTimeId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  canonicalProductId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  cmsPageId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  cmsPageVersionId: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
  productNumber: z.string(),
  stock: z.number().int(),
  restockTime: z.number().int().optional(),
  active: z.boolean().optional(),
  availableStock: z.number().int().optional(),
  available: z.boolean().optional(),
  isCloseout: z.boolean().optional(),
  displayGroup: z.string().optional(),
  manufacturerNumber: z.string().optional(),
  ean: z.string().optional(),
  purchaseSteps: z.number().int().optional(),
  maxPurchase: z.number().int().optional(),
  minPurchase: z.number().int().optional(),
  purchaseUnit: z.number().optional(),
  referenceUnit: z.number().optional(),
  shippingFree: z.boolean().optional(),
  markAsTopseller: z.boolean().optional(),
  weight: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  length: z.number().optional(),
  releaseDate: z.string().optional(),
  ratingAverage: z.number().optional(),
  categoryTree: z
    .array(z.string().regex(new RegExp("^[0-9a-f]{32}$")))
    .optional(),
  propertyIds: z
    .array(z.string().regex(new RegExp("^[0-9a-f]{32}$")))
    .optional(),
  optionIds: z.array(z.string().regex(new RegExp("^[0-9a-f]{32}$"))).optional(),
  streamIds: z.array(z.string().regex(new RegExp("^[0-9a-f]{32}$"))).optional(),
  categoryIds: z
    .array(z.string().regex(new RegExp("^[0-9a-f]{32}$")))
    .optional(),
  childCount: z.number().int().optional(),
  sales: z.number().int().optional(),
  states: z.array(z.string()).optional(),
  metaDescription: z.string().optional(),
  name: z.string(),
  keywords: z.string().optional(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  packUnit: z.string().optional(),
  packUnitPlural: z.string().optional(),
  customFields: z.record(z.any()).optional(),
  calculatedPrice: z.record(z.any()).optional(),
  calculatedPrices: z.array(z.any()).optional(),
  calculatedMaxPurchase: z
    .number()
    .int()
    .describe("Runtime field, cannot be used as part of the criteria.")
    .optional(),
  calculatedCheapestPrice: z.record(z.any()).optional(),
  isNew: z
    .boolean()
    .describe("Runtime field, cannot be used as part of the criteria.")
    .optional(),
  sortedProperties: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  translated: z.record(z.any()).optional(),
  extensions: z
    .object({
      reviewSummaries: z
        .object({
          links: z.object({ related: z.string().optional() }).optional(),
          data: z
            .array(
              z.object({
                type: z.string().optional(),
                id: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
      swagCustomizedProductsTemplate: z
        .object({
          links: z.object({ related: z.string().optional() }).optional(),
          data: z
            .object({
              type: z.string().optional(),
              id: z.string().regex(new RegExp("^[0-9a-f]{32}$")).optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  downloads: z.any().optional(),
  parent: z.any().optional(),
  children: z.any().optional(),
  deliveryTime: z.any().optional(),
  tax: z.any().optional(),
  manufacturer: z.any().optional(),
  unit: z.any().optional(),
  cover: z.any().optional(),
  cmsPage: z.any().optional(),
  canonicalProduct: z.any().optional(),
  media: z.any().optional(),
  crossSellings: z.any().optional(),
  configuratorSettings: z.any().optional(),
  productReviews: z.any().optional(),
  mainCategories: z.any().optional(),
  seoUrls: z.any().optional(),
  options: z.any().optional(),
  properties: z.any().optional(),
  categories: z.any().optional(),
  streams: z.any().optional(),
  categoriesRo: z.any().optional(),
  seoCategory: z.any().optional(),
});

export default productSchema;
