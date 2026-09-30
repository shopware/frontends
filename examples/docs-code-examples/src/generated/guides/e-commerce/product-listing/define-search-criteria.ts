const { search } = useListing();

search({
  limit: 2, // get only 2 products
  p: 1, // page 1
  includes: {
    // things we actually need in the response for learning purposes
    product: ["id", "name", "cover", "calculatedPrice"],
    product_media: ["media"],
    media: ["url"],
  },
});
