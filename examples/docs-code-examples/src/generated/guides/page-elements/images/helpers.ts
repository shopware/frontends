import { getMainImageUrl } from "@shopware/helpers";

const product = {
  cover: {
    media: {
      url: "https://example.com/product-cover.jpg",
    },
  },
};

const coverUrl = getMainImageUrl(product);
// coverUrl is now an URL to the resource (or undefined)
