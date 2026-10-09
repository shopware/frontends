import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import type { ListingSortOption } from "./listingFilterTypes";
import { getNextMenuItemIndex } from "./sortMenuKeyboard";
import { SwSortDropdown } from "./SwSortDropdown";

const sortOptions: ListingSortOption[] = [
  { key: "name-asc", label: "Name A-Z", translated: { label: "Name A-Z" } },
  {
    key: "price-asc",
    label: "Price ascending",
    translated: { label: "Price ascending" },
  },
];

describe("SwSortDropdown", () => {
  it("renders the Sort toggle with a menu of menuitems", async () => {
    const html = await renderToHtml(
      <SwSortDropdown
        sortOptions={sortOptions}
        currentSort="name-asc"
        label="Sort"
        onSortChange={() => {}}
      />,
    );
    expect(html).toContain('aria-haspopup="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('role="menu"');
    expect(html.match(/role="menuitem"/g)).toHaveLength(2);
    expect(html).toContain("Price ascending");
    expect(html).toContain("focus:outline-hidden");
    expect(html).not.toContain("outline-none");
  });
});

describe("getNextMenuItemIndex", () => {
  it("moves down and wraps to the first item", () => {
    expect(getNextMenuItemIndex("ArrowDown", -1, 3)).toBe(0);
    expect(getNextMenuItemIndex("ArrowDown", 0, 3)).toBe(1);
    expect(getNextMenuItemIndex("ArrowDown", 2, 3)).toBe(0);
  });

  it("moves up and wraps to the last item", () => {
    expect(getNextMenuItemIndex("ArrowUp", -1, 3)).toBe(2);
    expect(getNextMenuItemIndex("ArrowUp", 0, 3)).toBe(2);
    expect(getNextMenuItemIndex("ArrowUp", 2, 3)).toBe(1);
  });

  it("jumps to the ends and ignores other keys", () => {
    expect(getNextMenuItemIndex("Home", 2, 3)).toBe(0);
    expect(getNextMenuItemIndex("End", 0, 3)).toBe(2);
    expect(getNextMenuItemIndex("Enter", 0, 3)).toBeUndefined();
    expect(getNextMenuItemIndex("ArrowDown", 0, 0)).toBeUndefined();
  });
});
