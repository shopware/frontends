app.provide("apiClient", apiClient);
app.provide("shopware", shopwareContext);
// thanks to this, `shopwareContext` can be injected in a component and other Vue-instance-aware places (like composables).
app.provide("swSessionContext", ref());
