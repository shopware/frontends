import { describe, expect, it } from "vitest";
import { mergeJsonOverrides } from "./jsonOverrideUtils";
import type { OverridesSchema } from "./patchJsonSchema";

describe("mergeJsonOverrides", () => {
  it("should merge both object types", () => {
    const jsonObjects = [
      // api-types/storeApiTypes1.overrides.json
      {
        components: {
          Product: {
            required: ["weight"],
          },
        },
      },
      // api-types/storeApiTypes2.overrides.json
      {
        components: {
          Product: {
            required: ["versionId"],
          },
        },
      },
    ] as unknown as OverridesSchema[];

    const result = mergeJsonOverrides({}, ...jsonObjects);

    expect(result).toEqual({
      components: { Product: { required: ["versionId", "weight"] } },
    });
  });

  it("should merge both array types", () => {
    const jsonObjects = [
      // api-types/storeApiTypes1.overrides.json
      {
        components: {
          Product: [
            {
              required: ["weight"],
            },
          ],
        },
      },
      // api-types/storeApiTypes2.overrides.json
      {
        components: {
          Product: [
            {
              required: ["versionId"],
            },
          ],
        },
      },
    ] as unknown as OverridesSchema[];

    const result = mergeJsonOverrides({}, ...jsonObjects);

    expect(result).toEqual({
      components: {
        Product: [{ required: ["versionId"] }, { required: ["weight"] }],
      },
    });
  });

  it("should merge object and array types", () => {
    const jsonObjects = [
      // api-types/storeApiTypes1.overrides.json
      {
        components: {
          Product: {
            required: ["weight"],
          },
        },
      },
      // api-types/storeApiTypes2.overrides.json
      {
        components: {
          Product: [
            {
              required: ["versionId"],
            },
          ],
        },
      },
    ] as unknown as OverridesSchema[];

    const result = mergeJsonOverrides({}, ...jsonObjects);

    expect(result).toEqual({
      components: {
        Product: [{ required: ["weight"] }, { required: ["versionId"] }],
      },
    });
  });

  it("should merge array and object type", () => {
    const jsonObjects = [
      // api-types/storeApiTypes1.overrides.json
      {
        components: {
          Product: [
            {
              required: ["weight"],
            },
          ],
        },
      },
      // api-types/storeApiTypes2.overrides.json
      {
        components: {
          Product: {
            required: ["versionId"],
          },
        },
      },
    ] as unknown as OverridesSchema[];

    const result = mergeJsonOverrides({}, ...jsonObjects);

    expect(result).toEqual({
      components: {
        Product: [{ required: ["weight"] }, { required: ["versionId"] }],
      },
    });
  });
});
