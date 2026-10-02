import parse, {
  Element,
  attributesToProps,
  domToReact,
} from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import Link from "next/link";
import type { CSSProperties, ReactElement, ReactNode } from "react";

import { cx } from "../helpers/cx";
import { isInternalUrl, resolveCmsUrl } from "../helpers/resolveUrl";
import { sanitizeHtml } from "./sanitize";

const BUTTON_CLASS =
  "rounded-md inline-block my-2 py-2 px-4 border border-transparent text-sm font-medium focus:outline-hidden disabled:opacity-75";
const LINK_CLASS =
  "underline text-base font-normal text-brand-primary hover:text-brand-primary-hover";

export type RenderRichTextOptions = {
  urlPrefix: string;
};

function buttonClassName(className: string): string {
  return className
    .replace(/\bbtn\s+/, "")
    .replace(
      "btn-secondary",
      `${BUTTON_CLASS} bg-brand-secondary text-brand-on-secondary hover:bg-brand-secondary-hover`,
    )
    .replace(
      "btn-primary",
      `${BUTTON_CLASS} bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover`,
    )
    .trim();
}

function renderAnchor(
  node: Element,
  options: RenderRichTextOptions,
  parserOptions: HTMLReactParserOptions,
): ReactElement {
  const { href, class: className, ...attributes } = node.attribs;
  const props = attributesToProps(attributes);
  const resolvedHref = href
    ? resolveCmsUrl(href, options.urlPrefix)
    : undefined;
  const isButton = !!className?.includes("btn");
  const children = domToReact(node.children as DOMNode[], parserOptions);
  const finalClassName = isButton
    ? buttonClassName(className ?? "")
    : LINK_CLASS;

  if (resolvedHref && isInternalUrl(resolvedHref)) {
    return (
      <Link {...props} href={resolvedHref} className={finalClassName}>
        {children}
      </Link>
    );
  }

  return (
    <a {...props} href={resolvedHref} className={finalClassName}>
      {children}
    </a>
  );
}

function renderFont(
  node: Element,
  parserOptions: HTMLReactParserOptions,
): ReactElement {
  const { color, ...attributes } = node.attribs;
  const props = attributesToProps(attributes);
  const style: CSSProperties | undefined = color
    ? { color, ...(props.style as CSSProperties | undefined) }
    : (props.style as CSSProperties | undefined);
  return (
    <span {...props} style={style}>
      {domToReact(node.children as DOMNode[], parserOptions)}
    </span>
  );
}

function renderImage(node: Element): ReactElement {
  const props = attributesToProps(node.attribs);
  return (
    <img
      {...props}
      alt={node.attribs.alt ?? ""}
      loading="lazy"
      decoding="async"
    />
  );
}

export function renderRichText(
  html: string,
  options: RenderRichTextOptions,
): ReactNode {
  const parserOptions: HTMLReactParserOptions = {
    replace(node): ReactElement | undefined {
      if (!(node instanceof Element)) return undefined;
      if (node.name === "a") return renderAnchor(node, options, parserOptions);
      if (node.name === "font") return renderFont(node, parserOptions);
      if (node.name === "img") return renderImage(node);
      return undefined;
    },
  };

  return parse(sanitizeHtml(html), parserOptions);
}

export function richTextClassName(className?: string): string {
  return cx("cms-element-text", className);
}
