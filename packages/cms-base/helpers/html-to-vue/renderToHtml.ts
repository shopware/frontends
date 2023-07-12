/**
 * Based on the https://github.com/HCESrl/html-to-vue
 */

import { generateAST, rectifyAST } from "./ast";
import { renderer } from "./renderer";

type DefaultConfig = {
  container: {
    type: string;
  };
  extraComponentsMap: any;
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
  createElement: any,
  context: any,
) {
  const mergedConfig = Object.assign(defaultConfig, config);
  const _ast = generateAST(html);
  const _rectifiedAst = rectifyAST(_ast, config);

  return renderer(_rectifiedAst, mergedConfig, createElement, context);
}
