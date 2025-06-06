import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import json5 from "json5";
import ts from "typescript";

export function getTypePropertyNames(type: ts.Type) {
  return type.getProperties().map((prop) => prop.name);
}

export function getDeepProperty({
  type,
  names,
  node,
  typeChecker,
}: {
  type: ts.Type;
  names: string[];
  node: ts.Node;
  typeChecker: ts.TypeChecker;
}) {
  if (names.length === 0) {
    return type;
  }
  const [currentName, ...restNames] = names;
  if (!currentName) return undefined;

  const property = type.getProperty(currentName);
  if (!property) {
    return undefined;
  }

  const propertyType = typeChecker.getTypeOfSymbolAtLocation(property, node);

  return getDeepProperty({
    type: propertyType,
    names: restNames,
    node,
    typeChecker,
  });
}

export function getDeepPropertyCode({
  type,
  names,
  node,
  typeChecker,
}: {
  type: ts.Type;
  names: string[];
  node: ts.Node;
  typeChecker: ts.TypeChecker;
}) {
  const namesWithoutLast = names.slice(0, -1);
  const currentName = names[names.length - 1];
  if (!currentName) return undefined;
  const deepProperty = getDeepProperty({
    type,
    names: namesWithoutLast,
    node,
    typeChecker,
  });
  if (deepProperty) {
    const property = deepProperty.getProperty(currentName);
    if (!property) {
      return undefined;
    }
    return property.valueDeclaration?.getText().replace(/^[^:]+:/, "");
  }
  return undefined;
}

export function isOptional(symbol: ts.Symbol): boolean {
  const declarations = symbol.getDeclarations();
  if (!declarations) return false;

  // Assuming the property has only one declaration
  const declaration = declarations[0];

  // Check if the declaration has a question token
  if (
    declaration &&
    ts.isPropertySignature(declaration) &&
    declaration.questionToken !== undefined
  ) {
    return true; // Property is optional
  }

  // If it's not a property signature, check if it's a parameter
  if (
    declaration &&
    ts.isParameter(declaration) &&
    declaration.questionToken !== undefined
  ) {
    return true; // Parameter is optional
  }

  return false; // Property is required
}

export function isNeverType(symbol?: ts.Type): boolean {
  if (!symbol) return false;
  return symbol.flags === ts.TypeFlags.Never;
}

export async function loadLocalJSONFile<T = JSON>(
  path: string,
): Promise<T | undefined> {
  const localPath = resolve(path);
  if (existsSync(localPath)) {
    return json5.parse(readFileSync(localPath, "utf-8"));
  }
  return undefined;
}
