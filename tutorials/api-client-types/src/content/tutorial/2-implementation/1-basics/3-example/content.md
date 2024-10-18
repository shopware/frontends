---
type: lesson
title: Call the API
focus: /example.ts


---

# Call the Store API endpoint

## Add some logic to invoke API request

The example below shows how to call the API by using `invoke` method of `apiClient` instance.

```ts add={11-22}
/** example.ts */
export async function setupExample() {
  const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";
  const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";
  
  const apiClient = createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken: accessToken,
  });

  const loadContextButton = document?.querySelector("#loadContext");

  if (loadContextButton) {
    loadContextButton.addEventListener("click", async () => {
      const contextResult = await apiClient.invoke("readContext get /context");

      const resultContainer = document?.querySelector("#result");
      if (resultContainer) {
        resultContainer.innerHTML = JSON.stringify(contextResult.data, null, 2);
      }
    });
  }
}
```

See also the `index.html` file in the editor for this lesson to see the structure of DOM.


## Make use of `apiClient.invoke` method

Now we can use `invoke` method to execute the API request according to the operations described in the `operations` type. This time it's `readContext get /context` which can be found in exported types of `"@shopware/api-client/store-api-types"` lib path.

:::tip 
Click `Solve` button on the top right of the editor for this lesson to see the live example. In order to revert the changes use `Reset` button.
:::

```ts {15} filename="example.ts"
/** example.ts */
export async function setupExample() {
  const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";
  const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";
  
  const apiClient = createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken: accessToken,
  });

  const loadContextButton = document?.querySelector("#loadContext");

  if (loadContextButton) {
    loadContextButton.addEventListener("click", async () => {
      const contextResult = await apiClient.invoke("readContext get /context");

      const resultContainer = document?.querySelector("#result");
      if (resultContainer) {
        resultContainer.innerHTML = JSON.stringify(contextResult.data, null, 2);
      }
    });
  }
}
```
