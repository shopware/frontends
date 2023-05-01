---
"vue-demo-store": minor
---

Added template composable `useModal` which `SharedModal` component refactor.
New modal system is using Vue's Teleport feature to render modals outside of the root component and keeping component context in the modal.
