import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { ContentLanguageProvider } from "@/i18n/ContentLanguageProvider";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { lineItem, promotionItem } from "./cartView.fixture";
import { CheckoutProductTile } from "./CheckoutProductTile";

function render(item: Schemas["LineItem"]) {
  return renderToHtml(
    <CheckoutProductTile
      item={item}
      onRemove={vi.fn()}
      onChangeQuantity={vi.fn()}
      className="w-full"
    />,
  );
}

function tag(html: string, testId: string): string {
  const match = html.match(
    new RegExp(`<[a-z]+[^>]*data-testid="${testId}"[^>]*>`),
  );
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

describe("CheckoutProductTile", () => {
  it("renders the line item with the e2e test ids", async () => {
    const html = await render(lineItem());

    const tile = tag(html, "checkout-product-tile-item");
    expect(tile).toContain('data-product-id="product-1"');
    expect(tile).toContain("w-full");

    const image = tag(html, "checkout-product-tile-image");
    expect(image).toMatch(/^<img/);
    expect(image).toContain('src="https://cdn.test/cover-280.jpg"');
    expect(image).toContain('alt="Aerodynamic Bronze Brandix cart item"');

    expect(html).toContain("Aerodynamic Bronze Brandix</div>");
    expect(html).toContain("€39.98");
  });

  it("lists the variant options as group and option pairs", async () => {
    const html = await render(lineItem());

    const options = html.match(
      /<p[^>]*data-testid="cart-product-options"[^>]*>(.*?)<\/p>/,
    );
    expect(options?.[1]?.replace(/<!-- -->/g, "")).toBe(
      '<span class="mr-2">Size: XL</span><span class="mr-2">Color: Blue</span>',
    );
  });

  it("leaves out the options without any", async () => {
    const html = await render(lineItem({ payload: undefined }));

    expect(html).not.toContain("cart-product-options");
  });

  it("ignores option entries without a group and an option name", async () => {
    const html = await render(
      lineItem({
        payload: {
          options: [{ group: "Size" }, null, { group: "Color", option: "Red" }],
        } as unknown as Schemas["LineItem"]["payload"],
      }),
    );

    expect(html.replace(/<!-- -->/g, "")).toContain(
      '<span class="mr-2">Color: Red</span></p>',
    );
    expect(html).not.toContain("Size:");
  });

  it("offers the quantity within the purchase limits", async () => {
    const html = await render(
      lineItem({
        quantity: 4,
        quantityInformation: {
          minPurchase: 2,
          maxPurchase: 9,
          purchaseSteps: 2,
        },
      }),
    );

    const input = tag(html, "product-quantity");
    expect(input).toContain('value="4"');
    expect(input).toContain('min="2"');
    expect(input).toContain('max="8"');
    expect(input).toContain('step="2"');
  });

  it("renders the remove button only for a removable item", async () => {
    const removable = await render(lineItem());
    const button = tag(removable, "checkout-product-tile-remove-button");
    expect(button).toMatch(/^<button/);
    expect(button).toContain('type="button"');
    expect(removable).toContain(">Remove</button>");

    const fixed = await render(lineItem({ removable: false }));
    expect(fixed).not.toContain("checkout-product-tile-remove-button");
  });

  it("renders a placeholder instead of an image without a cover", async () => {
    const html = await render(lineItem({ cover: null }));

    expect(html).not.toContain("<img");
    expect(html).toContain(
      'data-testid="checkout-product-tile-image-placeholder"',
    );
  });

  it("uses the payload name in the image alt without a label", async () => {
    const html = await render(
      lineItem({
        label: "",
        payload: {
          name: "Payload name",
        } as unknown as Schemas["LineItem"]["payload"],
      }),
    );

    expect(tag(html, "checkout-product-tile-image")).toContain(
      'alt="Payload name cart item"',
    );
  });

  it("renders a promotion without quantity and options", async () => {
    const html = await render(promotionItem());

    expect(tag(html, "checkout-product-tile-item")).toContain(
      'data-product-id="SUMMER"',
    );
    expect(html).toContain("Summer sale</div>");
    expect(html).toContain("-€5.00");
    expect(html).not.toContain("product-quantity");
    expect(html).not.toContain("cart-product-options");
    expect(html).toContain("checkout-product-tile-remove-button");
  });

  it("renders a product that is not stackable without the quantity select", async () => {
    const html = await render(lineItem({ stackable: false }));

    expect(html).not.toContain("product-quantity");
    expect(html).toContain("cart-product-options");
  });
});

describe("CheckoutProductTile in other locales", () => {
  it("translates the image alt and the remove button", async () => {
    const html = await renderToHtml(
      withI18n(
        <CheckoutProductTile
          item={lineItem()}
          onRemove={vi.fn()}
          onChangeQuantity={vi.fn()}
        />,
        "pl-PL",
      ),
    );

    expect(tag(html, "checkout-product-tile-image")).toContain(
      'alt="Aerodynamic Bronze Brandix – produkt w koszyku"',
    );
    expect(html).toContain(">Usuń</button>");
  });

  it.each([
    ["pl-PL", "Ilość", "Zwiększ ilość", "Zmniejsz ilość"],
    ["de-DE", "Menge", "Menge erhöhen", "Vermindern Menge"],
  ] as const)(
    "labels the %s quantity stepper in the page language",
    async (locale, label, increase, decrease) => {
      const html = await renderToHtml(
        withI18n(
          <CheckoutProductTile
            item={lineItem()}
            onRemove={vi.fn()}
            onChangeQuantity={vi.fn()}
          />,
          locale,
        ),
      );

      expect(html).toContain(`aria-label="${decrease}"`);
      expect(html).toContain(`aria-label="${increase}"`);
      expect(tag(html, "product-quantity")).toContain(`aria-label="${label}"`);
      expect(html).not.toContain("Increase quantity");
    },
  );

  it("declares the content language on the Shopware label and options only", async () => {
    const html = await renderToHtml(
      withI18n(
        <ContentLanguageProvider lang="en-US">
          <CheckoutProductTile
            item={lineItem()}
            onRemove={vi.fn()}
            onChangeQuantity={vi.fn()}
          />
        </ContentLanguageProvider>,
        "pl-PL",
      ),
    );

    expect(html).toContain(
      '<div class="line-clamp-2" lang="en-US">Aerodynamic Bronze Brandix</div>',
    );
    expect(tag(html, "cart-product-options")).toContain('lang="en-US"');
    expect(tag(html, "checkout-product-tile-image")).not.toContain("lang=");
    expect(tag(html, "checkout-product-tile-remove-button")).not.toContain(
      "lang=",
    );
    expect(html.match(/lang="/g)).toHaveLength(2);
  });

  it("declares no language without a content language", async () => {
    const html = await render(lineItem());

    expect(html).not.toContain("lang=");
  });
});
