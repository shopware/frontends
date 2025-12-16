import type { Schemas } from "#shopware";

/**
 * Type-safe property extraction for content elements
 */
export function useContentProperties<T extends Record<string, unknown>>(
  properties: Record<string, unknown>,
) {
  return {
    get: <K extends keyof T>(key: K, defaultValue?: T[K]): T[K] | undefined => {
      const value = properties[key as string];
      return value !== undefined ? (value as T[K]) : defaultValue;
    },
    getRequired: <K extends keyof T>(key: K): T[K] => {
      const value = properties[key as string];
      if (value === undefined) {
        throw new Error(`Required property "${String(key)}" is missing`);
      }
      return value as T[K];
    },
    has: <K extends keyof T>(key: K): boolean => {
      return properties[key as string] !== undefined;
    },
    all: properties as Partial<T>,
  };
}

/**
 * Common property interfaces for content elements
 */
export interface ImageProperties extends Record<string, unknown> {
  media?: Schemas["Media"];
  url?: string;
  alt?: string;
  title?: string;
  displayMode?: "standard" | "cover" | "contain" | "auto";
  minHeight?: string;
  newTab?: boolean;
}

export interface TextProperties extends Record<string, unknown> {
  title?: string;
  content?: string;
  alignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
}

export interface ButtonProperties extends Record<string, unknown> {
  text?: string;
  url?: string;
  newTab?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  alignment?: "left" | "center" | "right";
}

export interface GridProperties extends Record<string, unknown> {
  columns?: number;
  gap?: "small" | "medium" | "large";
  displayMode?: "standard" | "cover";
}

export interface ProductCardProperties extends Record<string, unknown> {
  product?: Schemas["Product"];
  displayMode?: "standard" | "minimal" | "image";
  layout?: "standard" | "image";
}
