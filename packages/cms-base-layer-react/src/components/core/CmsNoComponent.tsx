"use client";

import { useEffect, useState } from "react";

import type { Schemas } from "#shopware";

import { getCmsComponentName, getCmsKind } from "../../registry";

type CmsNoComponentProps = {
  content: Schemas["CmsSection"] | Schemas["CmsBlock"] | Schemas["CmsSlot"];
};

const SCHEMA_BY_KIND = {
  section: 'Schemas["CmsSection"]',
  block: 'Schemas["CmsBlock"]',
  element: 'Schemas["CmsSlot"]',
} as const;

const REGISTRY_KEY_BY_KIND = {
  section: "sections",
  block: "blocks",
  element: "elements",
} as const;

export function CmsNoComponent({ content }: CmsNoComponentProps) {
  const kind = getCmsKind(content);
  const expectedComponentName = getCmsComponentName(content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const docsUrl = `https://developer.shopware.com/frontends/guides/cms/missing-component?${new URLSearchParams(
    { component: expectedComponentName, type: kind },
  )}`;

  const aiPrompt = [
    `Create a React server component \`${expectedComponentName}.tsx\` for a Shopware Frontends headless storefront built with @shopware/cms-base-layer-react.`,
    "",
    `This component renders the CMS ${kind} type: "${content.type}" (apiAlias: "${content.apiAlias}").`,
    "",
    "Requirements:",
    `- Accept \`content: ${SCHEMA_BY_KIND[kind]}\`, \`ctx: CmsContext\`, \`className\` and \`style\` props (CmsComponentProps)`,
    `- Spread \`className\` and \`style\` onto the root element`,
    `- Render the data for CMS ${kind} type "${content.type}"`,
    `- Follow patterns from the existing components in packages/cms-base-layer-react/src/components/${kind}/`,
    `- Register it in the CMS registry under ${REGISTRY_KEY_BY_KIND[kind]}["${content.type}"] with mergeCmsRegistries`,
    "",
    `The full content prop for this ${kind} is:`,
    JSON.stringify(content, null, 2),
    "",
    `Reference: ${docsUrl}`,
  ].join("\n");

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopied(true);
    } catch {
      console.warn("[CMS] Could not copy to clipboard. Prompt logged below:");
      console.info(aiPrompt);
    }
  }

  return (
    <div className="sw-cms-no-component box-border min-h-[40px] rounded border-2 border-dashed border-brand-primary bg-brand-secondary font-mono text-[11px] text-brand-on-secondary">
      <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5">
        <span className="text-brand-primary">⚠ missing implementation:</span>
        <span className="font-semibold">{expectedComponentName}</span>
        <a
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View CMS documentation"
          className="whitespace-nowrap rounded border border-outline-outline-primary bg-surface-surface px-[5px] py-px text-[10px] leading-none text-brand-primary no-underline hover:bg-brand-secondary-hover"
        >
          docs ↗
        </a>
        <button
          type="button"
          title="Copy AI prompt to clipboard"
          className="cursor-pointer whitespace-nowrap rounded border border-outline-outline-primary bg-surface-surface px-[5px] py-px font-mono text-[10px] leading-none text-brand-primary hover:bg-brand-secondary-hover"
          onClick={(event) => {
            event.stopPropagation();
            void copyPrompt();
          }}
        >
          {copied ? "copied ✓" : "copy AI prompt"}
        </button>
      </div>
    </div>
  );
}
