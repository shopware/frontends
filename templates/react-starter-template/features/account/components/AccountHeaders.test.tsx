import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { AccountPageHeader } from "./AccountPageHeader";
import { AccountSectionHeader } from "./AccountSectionHeader";

describe("AccountPageHeader", () => {
  it("renders the title as the page heading with the subtitle", async () => {
    const html = await renderToHtml(
      <AccountPageHeader
        className="mb-14"
        title="Overview"
        subtitle="Check your data."
      />,
    );

    expect(html).toBe(
      '<div class="flex flex-col gap-2 mb-14"><h1 class="font-serif text-[40px] leading-15 text-surface-on-surface">Overview</h1><p class="self-stretch text-surface-on-surface">Check your data.</p></div>',
    );
  });

  it("leaves out the subtitle when there is none", async () => {
    const html = await renderToHtml(<AccountPageHeader title="Orders" />);

    expect(html).toContain(">Orders</h1>");
    expect(html).not.toContain("<p");
  });
});

describe("AccountSectionHeader", () => {
  it("renders the title as a section heading above a rule", async () => {
    const html = await renderToHtml(
      <AccountSectionHeader className="mb-4" title="Personal data" />,
    );

    expect(html).toBe(
      '<div class="border-b border-outline-outline pb-2 mb-4"><h2 class="font-bold text-surface-on-surface">Personal data</h2></div>',
    );
  });
});
