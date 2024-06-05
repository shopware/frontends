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
}

export function isOptional(symbol: ts.Symbol): boolean {
  const declarations = symbol.getDeclarations();
  if (!declarations) return false;

  // Assuming the property has only one declaration
  const declaration = declarations[0];

  // Check if the declaration has a question token
  if (
    ts.isPropertySignature(declaration) &&
    declaration.questionToken !== undefined
  ) {
    return true; // Property is optional
  }

  // If it's not a property signature, check if it's a parameter
  if (ts.isParameter(declaration) && declaration.questionToken !== undefined) {
    return true; // Parameter is optional
  }

  return false; // Property is required
}
