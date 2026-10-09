import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { MainCounter } from "./MainCounter";

describe("MainCounter", () => {
  it("renders the count inside the badge", async () => {
    const html = await renderToHtml(<MainCounter count={7} />);

    expect(html).toMatch(
      /<span[^>]*bg-shell-accent [^>]*text-shell-on-accent[^>]*>7<\/span>/,
    );
  });

  it("appends the caller's positioning class", async () => {
    const html = await renderToHtml(
      <MainCounter count={2} className="absolute -top-2 left-1/2" />,
    );

    expect(html).toMatch(/class="[^"]*absolute -top-2 left-1\/2"/);
  });
});
