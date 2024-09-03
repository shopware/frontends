/**
 * Based on the https://github.com/HCESrl/html-to-vue
 */

import { generateAST, rectifyAST } from "./ast";
import { renderer } from "./renderer";
import { h, type ComponentInternalInstance } from "vue";

type DefaultConfig = {
  container: {
    type: string;
  };
  extraComponentsMap: Record<string, unknown>;
  renderAnyway: boolean;
  textTransformer: (text: string) => string;
};

const defaultConfig: DefaultConfig = {
  container: {
    type: "div",
  },
  extraComponentsMap: {},
  renderAnyway: false,
  textTransformer: (text: string) => text,
};

export function renderHtml(
  html: string,
  config: Partial<DefaultConfig>,
  createElement: typeof h,
  context: ComponentInternalInstance | null,
  resolveUrl: (url: string) => string,
) {
  const mergedConfig = Object.assign(defaultConfig, config);
  const _ast = generateAST(html);
  const _rectifiedAst = rectifyAST(_ast, config);

  return renderer(
    _rectifiedAst,
    mergedConfig,
    createElement,
    context,
    resolveUrl,
  );
}
