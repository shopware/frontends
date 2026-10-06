import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { billingAddress, otherAddress } from "../address.fixture";
import { AddressTile } from "./AddressTile";
import type { AddressTileProps } from "./AddressTile";

function noop() {}

function renderTile(props: Partial<AddressTileProps> = {}) {
  return renderToHtml(
    <AddressTile
      address={otherAddress}
      onDelete={noop}
      onSetAsDefaultBillingAddress={noop}
      onSetAsDefaultShippingAddress={noop}
      {...props}
    />,
  );
}

function tags(html: string, name: string, ...needles: string[]): string[] {
  return (html.match(new RegExp(`<${name}\\b[^>]*>`, "g")) ?? []).filter(
    (tag) => needles.every((needle) => tag.includes(needle)),
  );
}

function buttonWithText(html: string, text: string): string {
  const match = html.match(
    new RegExp(`(<button\\b[^>]*>)(?:(?!</button>).)*${text}</button>`),
  );
  expect(match).not.toBeNull();
  return match?.[1] ?? "";
}

const DESCRIBED_BY = 'aria-describedby="address-address-other"';

describe("AddressTile", () => {
  it("renders the address data with the translated country name", async () => {
    const html = await renderTile();

    expect(html).toContain('id="address-address-other"');
    expect(html).toContain(">Max<!-- --> <!-- -->Mustermann</div>");
    expect(html).toContain(">Side Street 3</div>");
    expect(html).toContain(">10115<!-- --> <!-- -->Berlin</div>");
    expect(html).toContain(">Polska</div>");
  });

  it("links Edit to the edit page and describes every action by the address", async () => {
    const html = await renderTile();

    expect(
      tags(
        html,
        "a",
        'href="/account/address/edit/address-other"',
        DESCRIBED_BY,
      ),
    ).toHaveLength(1);
    expect(html).toContain("Edit address</a>");
    expect(buttonWithText(html, "Delete address")).toContain(DESCRIBED_BY);
    expect(buttonWithText(html, "Use as default billing address")).toContain(
      DESCRIBED_BY,
    );
    expect(buttonWithText(html, "Use as default shipping address")).toContain(
      DESCRIBED_BY,
    );
    expect(tags(html, "button", 'type="button"')).toHaveLength(3);
  });

  it("offers neither delete nor the billing action for the default billing address", async () => {
    const html = await renderTile({
      address: billingAddress,
      isDefaultBillingAddress: true,
    });

    expect(html).not.toContain("Delete address");
    expect(html).not.toContain("Use as default billing address");
    expect(html).toContain("Use as default shipping address");
    expect(html).toMatch(
      /<li[^>]*>(?:(?!<\/li>).)*Default billing address<\/li>/,
    );
    expect(html).not.toContain("Default shipping address");
  });

  it("offers neither delete nor the shipping action for the default shipping address", async () => {
    const html = await renderTile({ isDefaultShippingAddress: true });

    expect(html).not.toContain("Delete address");
    expect(html).toContain("Use as default billing address");
    expect(html).not.toContain("Use as default shipping address");
    expect(html).toContain("Default shipping address</li>");
  });

  it("shows both badges and no actions but Edit for an address that is both defaults", async () => {
    const html = await renderTile({
      isDefaultBillingAddress: true,
      isDefaultShippingAddress: true,
    });

    expect(html).toContain("Default billing address</li>");
    expect(html).toContain("Default shipping address</li>");
    expect(html).not.toContain("<button");
    expect(html).toContain("Edit address</a>");
  });

  it("marks a deleting tile busy and disables its actions", async () => {
    const html = await renderTile({ isDeleting: true });

    expect(html).toMatch(/^<div\b[^>]*aria-busy="true"/);
    expect(html).toMatch(/^<div class="[^"]*opacity-50/);
    expect(
      tags(html, "a", 'aria-disabled="true"', 'tabindex="-1"'),
    ).toHaveLength(1);
    expect(tags(html, "button", 'disabled=""')).toHaveLength(3);
    expect(buttonWithText(html, "Delete address")).toContain(
      'aria-busy="true"',
    );
  });

  it("marks only the pending default action busy", async () => {
    const html = await renderTile({ pendingDefault: "shipping" });

    expect(tags(html, "button", 'aria-busy="true"')).toHaveLength(1);
    expect(buttonWithText(html, "Use as default shipping address")).toContain(
      'aria-busy="true"',
    );
    expect(tags(html, "button", 'disabled=""')).toHaveLength(3);
  });
});
