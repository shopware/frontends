---
head:
  - - meta
    - name: og:title
      content: "Integrations: Broadcasting - Shopware Frontends"
  - - meta
    - name: og:description
      content: "Example of usage broadcasting"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Integration:%20**Broadcasting**?fontSize=100px"
---

# Broadcasting

The Broadcast Channel API allows simple communication between browsing contexts (e.g., different tabs, iframes, or workers) on the same origin.

For Vue app we are recommending to use `useBroadcastChannel` from `VueUse` [package](https://vueuse.org/core/useBroadcastChannel/)

## Channel initialization

`useBroadcastChannel` is called with an object that has a name property. The name property is the name of the channel we want to create or connect to.

The `useBroadcastChannel` composable returns an object that contains a data property. This data property is updated whenever a message is received on the channel. You can use this data property in your component to react to incoming messages.

```ts
const { data } = useBroadcastChannel({
  name: broadcastChannelName,
});
```

## Event emitting

```ts
const { isSupported } = useBroadcastChannel({
  name: broadcastChannelName,
});
const { actions, post } = useBroadcastConsumer();

async function invokeLogout() {
  await logout();
  isAccountMenuOpen.value = false;

  if (isSupported) {
    await post("loggedOut");
  }
}
```

If the Broadcast Channel API is supported in the user's browser (checked using `isSupported` in ), we broadcast a loggedOut event using the post function. This event can be listened for in other parts of the application (or in other tabs/windows of the same origin) to react to the user logging out.

This `invokeLogout` function would typically be called when the user clicks a "Log Out" button or link in the application.

## Event consuming (logout example)

```ts
const consume = async (operation: string) => {
  switch (operation) {
    case "loggedOut":
      try {
        await refreshSessionContext();
      } catch (error) {
        console.error("[useBroadcastConsumer][consume]", error);
      }
      break;
  }
};
```

In the code snippet above, we use a switch statement to handle different types of operations. In this case, we only handle the loggedOut operation. When a loggedOut operation is received, the `refreshSessionContext ` function is called.

This consume function would typically be called whenever a message is received on the broadcast channel. The operation in the message would be passed to the consume function, which would then handle the operation accordingly.
