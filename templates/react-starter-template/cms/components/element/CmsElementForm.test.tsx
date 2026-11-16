import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementForm as CmsElementFormContent } from "../../types";
import { CmsElementCustomForm } from "./CmsElementCustomForm";
import { CmsElementForm } from "./CmsElementForm";

const salutations = [
  {
    id: "sal-1",
    salutationKey: "mr",
    displayName: "Mr.",
    letterName: "Dear Mr.",
    translated: { displayName: "Herr", letterName: "Sehr geehrter Herr" },
    apiAlias: "salutation",
  },
  {
    id: "sal-2",
    salutationKey: "mrs",
    displayName: "Mrs.",
    letterName: "Dear Mrs.",
    translated: {},
    apiAlias: "salutation",
  },
] as unknown as Schemas["Salutation"][];

function formSlot(
  config: Partial<CmsElementFormContent["config"]> = {},
  data: unknown = salutations,
): CmsElementFormContent {
  return {
    id: "slot-1",
    apiAlias: "cms_slot",
    type: "form",
    slot: "content",
    blockId: "block-1",
    config,
    data,
  } as unknown as CmsElementFormContent;
}

const ctx = createCmsContext({
  registry: createCmsRegistry(),
  foreignKey: "nav-1",
});

const fieldId = (name: string) => new RegExp(`id="[^"]*${name}"`);

describe("CmsElementForm", () => {
  it("renders the contact form by default with the layout props on the root", async () => {
    const html = await renderToHtml(
      <CmsElementForm
        content={formSlot()}
        ctx={ctx}
        className="mt-2"
        style={{ marginBottom: "4px" }}
      />,
    );

    expect(html).toContain(
      '<div class="cms-element-form mt-2" style="margin-bottom:4px">',
    );
    expect(html).toContain('<form class="w-full relative">');
    expect(html).toContain(">Contact</h3>");
    expect(html).toMatch(fieldId("first-name"));
    expect(html).toMatch(fieldId("email-address"));
    expect(html).toMatch(fieldId("phone"));
    expect(html).toMatch(fieldId("subject"));
    expect(html).toMatch(fieldId("comment"));
    expect(html).toMatch(fieldId("privacy"));
    expect(html).toContain("I have read the data protection information.");
    expect(html).toContain('type="submit"');
  });

  it("lists the translated salutations and the disabled placeholder", async () => {
    const html = await renderToHtml(
      <CmsElementForm content={formSlot()} ctx={ctx} />,
    );

    expect(html).toContain(
      '<option disabled="" value="" selected="">Enter salutation...',
    );
    expect(html).toContain('<option value="sal-1">Herr</option>');
    expect(html).toContain('<option value="sal-2">Mrs.</option>');
  });

  it("uses the configured title and the cms translations", async () => {
    const html = await renderToHtml(
      <CmsElementForm
        content={formSlot({
          title: { source: "static", value: "Write to us" },
        })}
        ctx={{
          ...ctx,
          translations: { form: { firstName: "Vorname" } },
        }}
      />,
    );

    expect(html).toContain(">Write to us</h3>");
    expect(html).toContain("Vorname *");
    expect(html).toContain("Last name *");
  });

  it("renders the newsletter form for the newsletter type", async () => {
    const html = await renderToHtml(
      <CmsElementForm
        content={formSlot({ type: { source: "static", value: "newsletter" } })}
        ctx={ctx}
      />,
    );

    expect(html).toContain(">Subscribe to newsletter</h3>");
    expect(html).toMatch(fieldId("option"));
    expect(html).toContain(
      '<option value="subscribe" selected="">Subscribe to newsletter</option>',
    );
    expect(html).toContain(
      '<option value="unsubscribe">Unsubscribe from newsletter</option>',
    );
    expect(html).toMatch(fieldId("salutation"));
    expect(html).toContain('<option value="sal-1">Herr</option>');
    expect(html).not.toMatch(fieldId("phone"));
  });

  it("renders without salutations when data is missing", async () => {
    const html = await renderToHtml(
      <CmsElementForm content={formSlot({}, null)} ctx={ctx} />,
    );

    expect(html).toMatch(fieldId("salutation"));
    expect(html).not.toContain("<option value=");
  });
});

describe("CmsElementCustomForm", () => {
  it("renders the same form as CmsElementForm", async () => {
    const html = await renderToHtml(
      <CmsElementCustomForm
        content={formSlot()}
        ctx={ctx}
        className="hidden"
      />,
    );

    expect(html).toContain('<div class="cms-element-form hidden">');
    expect(html).toContain(">Contact</h3>");
  });
});
