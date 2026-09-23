// useProductCustomizedProductConfigurator is autoimported
// in vue-demo-store template as it's located in ~/composables
const {
  isActive, // indicates whether product is empowered by Custom Products extension and active
  customizedProduct, // returns the custom product's template data
  state, // state to be used in option selector / forms
  addToCart, // triggers add to cart action (refreshCart() action invoked afterwards)
  handleFileUpload, // uploads an image, then gets mediaId from API and assigns it to the state
} = useProductCustomizedProductConfigurator();
