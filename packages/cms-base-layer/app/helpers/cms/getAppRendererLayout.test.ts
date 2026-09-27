import type { CmsBlockAppRenderer } from "@shopware/composables";
import { describe, expect, it } from "vitest";

import { getAppRendererLayout } from "./getAppRendererLayout";

const block = (
  customFields: CmsBlockAppRenderer["customFields"],
  slots: string[] = [],
) =>
  ({
    type: "app-renderer",
    customFields,
    slots: slots.map((slot) => ({ id: slot, slot, type: slot.split("-")[0] })),
  }) as unknown as CmsBlockAppRenderer;

describe("getAppRendererLayout", () => {
  it("reads the app block name and grid", () => {
    const layout = getAppRendererLayout(
      block({
        appBlockName: "swag-two-columns",
        slotLayout: { grid: "auto / auto auto" },
      }),
    );

    expect(layout.appBlockName).toBe("swag-two-columns");
    expect(layout.grid).toBe("auto / auto auto");
  });

  it.each([
    ["swag-two-columns", "CmsBlockAppRendererSwagTwoColumns"],
    ["SwagTwoColumns", "CmsBlockAppRendererSwagTwoColumns"],
    ["swag_two_columns", "CmsBlockAppRendererSwagTwoColumns"],
  ])(
    "derives the override component name from %s",
    (appBlockName, expected) => {
      expect(getAppRendererLayout(block({ appBlockName })).componentName).toBe(
        expected,
      );
    },
  );

  it("has no override component and no grid without custom fields", () => {
    const layout = getAppRendererLayout(block(null));

    expect(layout.appBlockName).toBe("");
    expect(layout.componentName).toBeUndefined();
    expect(layout.grid).toBeUndefined();
  });

  it("orders the slots by the index in their name", () => {
    const layout = getAppRendererLayout(
      block({ appBlockName: "swag" }, [
        "image-2",
        "text-0",
        "text-10",
        "image-1",
      ]),
    );

    expect(layout.slots.map((slot) => slot.slot)).toEqual([
      "text-0",
      "image-1",
      "image-2",
      "text-10",
    ]);
  });

  it("keeps slots without an index after the indexed ones, in their order", () => {
    const layout = getAppRendererLayout(
      block({ appBlockName: "swag" }, ["content", "text-1", "left", "text-0"]),
    );

    expect(layout.slots.map((slot) => slot.slot)).toEqual([
      "text-0",
      "text-1",
      "content",
      "left",
    ]);
  });

  it("does not reorder the block's own slots", () => {
    const content = block({ appBlockName: "swag" }, ["text-1", "text-0"]);

    getAppRendererLayout(content);

    expect(content.slots.map((slot) => slot.slot)).toEqual([
      "text-1",
      "text-0",
    ]);
  });
});
