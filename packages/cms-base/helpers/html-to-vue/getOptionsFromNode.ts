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
  attrs?: Record<string, string>;
  class?: string;
  color?: string;
  style?: string;
};

export function getOptionsFromNode(node: any): Options {
  let style = null;
  let classNames = null;
  let align = null;

  if (node.attrs.style && node.attrs.style !== "") {
    style = node.attrs.style;
    delete node.attrs.style; // we delete the nodes otherwise it would be added to rest again
  }

  if (node.attrs.class && node.attrs.class !== "") {
    classNames = node.attrs.class;
    delete node.attrs.class;
  }

  if (node.attrs.align && node.attrs.align !== "") {
    align = node.attrs.align;
    delete node.attrs.align;
  }

  const attrs = Object.keys(node.attrs).length === 0 ? null : { ...node.attrs };

  return {
    align: align,
    attrs: attrs,
    class: classNames,
    style: style,
  };
}
