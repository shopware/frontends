import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { SwitchButton } from "./SwitchButton";

describe("SwitchButton", () => {
  it("exposes the checkbox as the single switch control", async () => {
    const html = await renderToHtml(
      <SwitchButton
        name="shipping-free"
        label="Shipping free"
        checked
        onChange={() => {}}
      />,
    );
    expect(html.match(/<label/g)).toHaveLength(1);
    expect(html).toContain('for="switch-shipping-free"');
    expect(html).toContain('id="switch-shipping-free"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-checked="true"');
    expect(html.match(/role="switch"/g)).toHaveLength(1);
    expect(html).not.toContain("tabindex");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("focus:outline-hidden");
    expect(html).not.toContain("outline-none");
  });

  it("renders the track off when unchecked", async () => {
    const html = await renderToHtml(
      <SwitchButton label="Shipping free" checked={false} />,
    );
    expect(html).toContain('aria-checked="false"');
    expect(html).toContain("bg-surface-surface-container-highest");
    expect(html).not.toContain("switch-track--on");
  });
});
