export type NodeObject = {
  type: string;
  name: string;
  attrs?: Options;
  children: NodeObject[];
  voidElement: boolean;
  content: string;
};

type Options = {
  align?: string;
  attrs: Record<string, string>;
  class?: string;
  color?: string;
  style?: string;
  href?: string;
};

export function getOptionsFromNode(
  node: NodeObject,
  resolveUrl: (url: string) => string,
): Options {
  const response: Options = {
    attrs: {},
  };
  try {
    if (!node?.attrs) {
      return response;
    }

    const { align, style, class: classNames, href, ...attrs } = node.attrs;

    if (align) {
      response.align = align;
    }
    if (style) {
      response.style = style;
    }
    if (classNames) {
      response.class = classNames;
    }
    if (attrs && Object.keys(attrs).length > 0) {
      response.attrs = attrs as unknown as Record<string, string>;
    }
    if (href) {
      response.attrs.href = resolveUrl(href);
    }
  } catch (e) {
    console.error("[Shopware][cms][getOptionsFromNode] error", e);
  }
  return response;
}
