import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { PersonalDataSection } from "./PersonalDataSection";

describe("PersonalDataSection", () => {
  it("renders the name and the email as two data rows", async () => {
    const html = await renderToHtml(
      <PersonalDataSection
        customerName="Jane Doe"
        customerEmail="jane@example.com"
      />,
    );

    const row =
      '<div class="self-stretch text-base leading-normal font-normal text-surface-on-surface">';
    expect(html).toBe(
      `<div class="flex flex-col gap-2">${row}Jane Doe</div>${row}jane@example.com</div></div>`,
    );
  });
});
