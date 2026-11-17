import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a bare input when it gets no label or description", async () => {
    const html = await renderToHtml(
      <Checkbox id="opt" checked={false} onChange={() => {}} />,
    );
    expect(html).not.toContain("<label");
    expect(html).toContain('<input id="opt"');
    expect(html).toContain('type="checkbox"');
  });

  it("wraps the input in a label when it gets a label", async () => {
    const html = await renderToHtml(
      <Checkbox
        checked
        onChange={() => {}}
        label="Newsletter"
        description="Weekly"
      />,
    );
    expect(html.match(/<label/g)).toHaveLength(1);
    expect(html).toContain('checked=""');
    expect(html).toContain("Newsletter");
    expect(html).toContain("Weekly");
  });
});
