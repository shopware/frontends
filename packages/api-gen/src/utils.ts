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
    console.error("property not found", currentName);
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
      console.error("property not found", currentName);
      return undefined;
    }
    return property.valueDeclaration?.getText().replace(/^[^:]+:/, "");
  }

  console.error("Property not found", names);
}
