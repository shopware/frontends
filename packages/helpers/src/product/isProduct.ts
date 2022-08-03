import { Product } from "@shopware-pwa/types";

export function isProduct<T extends { apiAlias: string }>(
  entity: T | Product
): entity is Product {
  return entity.apiAlias === "product";
}
