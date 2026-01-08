/**
 * Based on the https://github.com/HCESrl/html-to-vue
 */

import type { ComponentInternalInstance, h } from "vue";
import { type RectifyConfig, generateAST, rectifyAST } from "./ast";
import { type RendererConfig, renderer } from "./renderer";

type DefaultConfig = RendererConfig;

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
  const rectifyConfig: RectifyConfig = {
    extraComponentsMap: config.extraComponentsMap,
  };
  const _rectifiedAst = rectifyAST(_ast, rectifyConfig);

  return renderer(
    _rectifiedAst,
    mergedConfig,
    createElement,
    context,
    resolveUrl,
  );
}
