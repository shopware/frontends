import { describe, expect, it } from "vitest";

import { ContentLanguageProvider } from "@/i18n/ContentLanguageProvider";
import { renderToHtml } from "@/test/render";

import { OrderMethodCard } from "./OrderMethodCard";
import { OrderStatus } from "./OrderStatus";

describe("OrderMethodCard", () => {
  it("declares the content language on the method name only", async () => {
    const html = await renderToHtml(
      <ContentLanguageProvider lang="en-US">
        <OrderMethodCard
          label="Versandart"
          title="Standard"
          description="Dauert bis zu 1-3 days"
        />
      </ContentLanguageProvider>,
    );

    expect(html).toContain('lang="en-US">Standard</div>');
    expect(html.match(/lang="/g)).toHaveLength(1);
  });

  it("declares no language without a content language", async () => {
    const html = await renderToHtml(
      <OrderMethodCard label="Shipping method" title="Standard" />,
    );

    expect(html).not.toContain("lang=");
  });
});

describe("OrderStatus", () => {
  it("declares the content language on the Shopware state name", async () => {
    const html = await renderToHtml(
      <ContentLanguageProvider lang="en-US">
        <OrderStatus state={{ technicalName: "open", name: "Open" }} />
      </ContentLanguageProvider>,
    );

    expect(html).toMatch(/^<span lang="en-US" [^>]*>Open<\/span>$/);
  });
});
