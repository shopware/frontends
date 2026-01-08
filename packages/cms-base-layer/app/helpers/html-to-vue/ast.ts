/**
 * Based on the https://github.com/HCESrl/html-to-vue
 */
// @ts-expect-error - html-to-ast has type definition issues with package.json exports
import { parse } from "html-to-ast";
import type { NodeObject } from "./getOptionsFromNode";

type ASTNode = NodeObject | NodeObject[];

type VisitCallback = (
  node: unknown,
  parent: NodeObject | null,
  key: string | null,
  index: number | undefined,
) => void;

type ExtraComponentConfig = {
  conditions: (node: NodeObject) => boolean;
  renderer?: unknown;
};

export type RectifyConfig = {
  extraComponentsMap?: Record<string, ExtraComponentConfig>;
};

/**
 * Visit each node in the AST - with callback (adapted from https://lihautan.com/manipulating-ast-with-javascript/)
 * @param ast html-parse-stringify AST
 * @param callback
 */
function _visitAST(ast: ASTNode, callback: VisitCallback): void {
  function _visit(
    node: unknown,
    parent: NodeObject | null,
    key: string | null,
    index: number | undefined,
  ): void {
    callback(node, parent, key, index);
    if (Array.isArray(node)) {
      // node is an array
      node.forEach((value, idx) => {
        _visit(value, node as unknown as NodeObject, null, idx);
      });
    } else if (isNode(node)) {
      const keys = Object.keys(node);
      for (let i = 0; i < keys.length; i++) {
        const childKey = keys[i];
        if (childKey === undefined) continue;
        const child = (node as Record<string, unknown>)[childKey];
        if (Array.isArray(child)) {
          for (let j = 0; j < child.length; j++) {
            _visit(child[j], node, key, j);
          }
        } else if (isNode(child)) {
          _visit(child, node, key, undefined);
        }
      }
    }
  }
  _visit(ast, null, null, undefined);
}

/**
 *
 * @param node html-parse-stringify AST node
 * @returns {boolean}
 */
export function isNode(node: unknown): node is NodeObject {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof (node as NodeObject).type !== "undefined"
  );
}

export function generateAST(html: string): ASTNode {
  return parse(html) as ASTNode;
}

/**
 * Converts ast html nodes in vue components
 * @param ast
 * @param config
 * @returns {*}
 */
export function rectifyAST(ast: ASTNode, config: RectifyConfig): ASTNode {
  const _ast = JSON.parse(JSON.stringify(ast)) as ASTNode;
  const keys = config.extraComponentsMap
    ? Object.keys(config.extraComponentsMap)
    : [];
  _visitAST(_ast, (node) => {
    if (!isNode(node)) {
      return;
    }
    // checking whether the AST has some components that has to become Vue Components
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      if (currentKey === undefined) continue;
      const componentConfig = config.extraComponentsMap?.[currentKey];
      if (componentConfig?.conditions(node)) {
        node.name = currentKey;
      }
    }
  });
  return _ast;
}
