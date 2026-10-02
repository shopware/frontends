import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { SwSlider } from "./SwSlider";

const slides = [
  <div key="a">slide a</div>,
  <div key="b">slide b</div>,
  <div key="c">slide c</div>,
];

describe("SwSlider", () => {
  it("renders the slides with clones on both sides and the SSR track style", async () => {
    const html = await renderToHtml(
      <SwSlider navigationArrows="inside" navigationDots="outside">
        {slides}
      </SwSlider>,
    );

    expect(html).toContain("pb-15");
    expect(html).not.toContain("px-10");
    expect(html).toContain('data-index="-1"');
    expect(html).toContain('data-index="3"');
    expect(html.match(/slide a/g)).toHaveLength(2);
    expect(html).toContain("width:500%");
    expect(html).toContain("transform:translateX(-20%)");
    expect(html).toContain('aria-label="Previous slide"');
    expect(html).toContain('aria-label="Go to slide 3"');
    expect(html).toContain("bg-white/20");
  });

  it("renders without clones when loop is off", async () => {
    const html = await renderToHtml(
      <SwSlider loop={false} navigationArrows="outside">
        {slides}
      </SwSlider>,
    );

    expect(html).toContain("px-10");
    expect(html).not.toContain('data-index="-1"');
    expect(html.match(/slide a/g)).toHaveLength(1);
    expect(html).toContain("width:300%");
    expect(html).toContain("transform:translateX(-0%)");
    expect(html).toContain("bg-brand-tertiary");
  });

  it("emits responsive SSR css for breakpoints", async () => {
    const html = await renderToHtml(
      <SwSlider
        slidesToShow={2}
        gap="1rem"
        displayMode="contain"
        verticalAlign="center"
        ssrBreakpoints={{ "(min-width: 768px)": 2 }}
      >
        {slides}
      </SwSlider>,
    );

    expect(html).toContain("<style>");
    expect(html).toContain(
      "width:700%;transform:translateX(-28.57142857142857%)",
    );
    expect(html).toContain("@media (min-width: 768px)");
    expect(html).toContain("data-ssr-slider=");
    expect(html).toContain("flex items-center");
    expect(html).toContain("padding:0 1rem");
    expect(html).toContain("height:100%");
  });
});
