export type ListingFilterOption = {
  id: string;
  name?: string;
  translated?: { name?: string };
  count?: number;
};

export type ListingFilter = {
  id?: string;
  code: string;
  label: string;
  name?: string;
  min?: number;
  max?: number;
  options?: ListingFilterOption[];
  entities?: ListingFilterOption[];
};

export type ListingFilterDisplayMode = "accordion" | "dropdown";

export type ListingFilterValue =
  | string
  | number
  | boolean
  | undefined
  | { min: number; max: number };

export type ListingFilterChangeEvent = {
  code: string;
  value: ListingFilterValue;
};

export type SelectedListingFilters = {
  price: { min: number | undefined; max: number | undefined };
  rating: number | undefined;
  "shipping-free": boolean | undefined;
  manufacturer: string[];
  properties: string[];
  categories: string[];
};

export type ListingFilterChip = {
  label: string;
  code: string;
  value: string | number;
};

export type ListingSortOption = {
  key: string;
  label: string | null;
  translated?: { label: string };
};
