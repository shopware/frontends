const { loadAssociations, isLoading, productAssociations } =
  useProductAssociations(product, {
    associationContext: "cross-selling",
  });
