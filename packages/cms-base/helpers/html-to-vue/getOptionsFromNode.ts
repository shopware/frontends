type Options = {
  align: String | null;
  attrs: Object | null;
  class: String | null;
  style: String | null;
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

  const { ...rest } = node.attrs;
  let attrs = rest;

  if (Object.keys(rest).length === 0) {
    attrs = null;
  }

  return {
    align: align,
    attrs: attrs,
    class: classNames,
    style: style,
  };
}
