type Options = {
  style: String;
  class: String;
  attrs: Object;
};

export function getOptionsFromNode(node: any): Options {
  const { style, class: classArs, ...rest } = node.attrs;

  return {
    style,
    attrs: rest,
    class: classArs,
  };
}
