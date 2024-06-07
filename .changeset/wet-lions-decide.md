---
"@shopware-pwa/composables-next": major
"vue-demo-store": minor
---

`useCustomerPassword` and `loadCustomerAddresses` inside `useAddress` are now throwing api errors on invocation. The `errors` object has been removed from the composable to make consistent error handling across the composables. This change is breaking and requires you to update your implementation of the composables.

Example of error handling for resseting password:

```typescript
const {
  resetPassword,
  // errors --> removed from the API
} = useCustomerPassword();

const errors = ref([]);

const invokeRecover = async (): Promise<void> => {
  try {
    errors.value = [];
    const emailSent = await resetPassword(formData.value);

    if (emailSent.success) {
      // here we know that email was sent
    }
  } catch (error) {
    console.error("[AccountRecoverPassword]", error);
    if (error instanceof ApiClientError) {
      errors.value = error.details?.errors || [];
    }
  }
};
```
