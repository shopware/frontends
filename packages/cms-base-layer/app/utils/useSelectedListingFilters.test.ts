import { describe, expect, it } from "vitest";

import {
  applyQueryToFilters,
  createEmptyFilterState,
} from "./useSelectedListingFilters";

describe("applyQueryToFilters", () => {
  it("populates sets from pipe-joined values", () => {
    const state = createEmptyFilterState();
    applyQueryToFilters(state, {
      manufacturer: "a|b",
      properties: "x",
      categories: "c1|c2",
    });
    expect([...state.manufacturer]).toEqual(["a", "b"]);
    expect([...state.properties]).toEqual(["x"]);
    expect([...state.categories]).toEqual(["c1", "c2"]);
  });

  it("clears removed filters when the query no longer has them (Back/Forward)", () => {
    const state = createEmptyFilterState();
    applyQueryToFilters(state, {
      manufacturer: "a|b",
      categories: "c1",
      search: "shirt",
    });
    applyQueryToFilters(state, { search: "shirt" }); // manufacturer + categories removed
    expect(state.manufacturer.size).toBe(0);
    expect(state.properties.size).toBe(0);
    expect(state.categories.size).toBe(0);
  });

  it("clears removed scalar filters on resync", () => {
    const state = createEmptyFilterState();
    applyQueryToFilters(state, {
      "min-price": "10",
      "max-price": "20",
      rating: "4",
      "shipping-free": "true",
    });
    applyQueryToFilters(state, {});
    expect(state["min-price"]).toBeUndefined();
    expect(state["max-price"]).toBeUndefined();
    expect(state.rating).toBeUndefined();
    expect(state["shipping-free"]).toBeUndefined();
  });

  it("keeps the Set identity stable across re-applies (reactive binding)", () => {
    const state = createEmptyFilterState();
    const manufacturerRef = state.manufacturer;
    const propertiesRef = state.properties;
    applyQueryToFilters(state, { manufacturer: "a" });
    expect(state.manufacturer).toBe(manufacturerRef);
    expect(state.properties).toBe(propertiesRef);
  });

  it("drops empty members from pipe-joined values", () => {
    const state = createEmptyFilterState();
    applyQueryToFilters(state, { manufacturer: "a||b|" });
    expect([...state.manufacturer]).toEqual(["a", "b"]);
  });

  it("parses scalars array/NaN-safe and ignores junk", () => {
    const state = createEmptyFilterState();
    applyQueryToFilters(state, {
      "min-price": ["10", "20"],
      "max-price": "abc",
      rating: "4",
      "shipping-free": "true",
    });
    expect(state["min-price"]).toBe(10); // first of repeated param
    expect(state["max-price"]).toBeUndefined(); // NaN -> undefined
    expect(state.rating).toBe(4);
    expect(state["shipping-free"]).toBe(true);
  });

  it("treats shipping-free other than 'true' as false", () => {
    const state = createEmptyFilterState();
    applyQueryToFilters(state, { "shipping-free": "false" });
    expect(state["shipping-free"]).toBe(false);
  });

  it("is idempotent (same query twice -> equal state)", () => {
    const state = createEmptyFilterState();
    const query = { manufacturer: "a|b", rating: "4" };
    applyQueryToFilters(state, query);
    applyQueryToFilters(state, query);
    expect([...state.manufacturer]).toEqual(["a", "b"]);
    expect(state.rating).toBe(4);
  });
});
