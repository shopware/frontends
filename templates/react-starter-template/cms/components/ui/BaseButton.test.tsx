import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { BaseButton } from "./BaseButton";

describe("BaseButton", () => {
  it("draws the focus ring of the secondary variant in the focus outline color", async () => {
    const html = await renderToHtml(
      <BaseButton variant="secondary">Retry</BaseButton>,
    );

    expect(html).toContain("focus:ring-outline-outline-focus");
    expect(html).not.toContain("focus:ring-brand-secondary");
  });
});
