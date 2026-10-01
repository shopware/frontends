import { getListingFilters, getTranslatedProperty } from "@shopware/helpers";

import type {
  ListingFilter,
  ListingFilterOption,
} from "../shared/listingFilterTypes";

type SourceListingFilter = ReturnType<typeof getListingFilters>[number] & {
  min?: number;
  max?: number;
  translated?: { name?: string };
};

type SourceListingFilterOption = {
  id: string;
  name?: string;
  translated?: { name?: string };
  count?: number;
};

function toClientListingFilterOption(
  option: SourceListingFilterOption,
): ListingFilterOption {
  const clientOption: ListingFilterOption = { id: option.id };
  const name = getTranslatedProperty(option, "name");
  if (name) clientOption.name = name;
  if (typeof option.count === "number") clientOption.count = option.count;
  return clientOption;
}

function toClientListingFilter(filter: SourceListingFilter): ListingFilter {
  const clientFilter: ListingFilter = {
    code: filter.code,
    label: filter.label,
  };
  const name = getTranslatedProperty(filter, "name");
  if (filter.id) clientFilter.id = filter.id;
  if (name) clientFilter.name = name;
  if (typeof filter.min === "number") clientFilter.min = filter.min;
  if (typeof filter.max === "number") clientFilter.max = filter.max;
  if (filter.options) {
    clientFilter.options = filter.options.map(toClientListingFilterOption);
  }
  if (filter.entities) {
    clientFilter.entities = filter.entities.map(toClientListingFilterOption);
  }
  return clientFilter;
}

export function getClientListingFilters(
  aggregations: Parameters<typeof getListingFilters>[0],
): ListingFilter[] {
  return getListingFilters(aggregations).map((filter) =>
    toClientListingFilter(filter as SourceListingFilter),
  );
}
