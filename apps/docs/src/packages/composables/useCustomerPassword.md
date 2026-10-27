# useCustomerPassword

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#customer--account"><div class="bg-red">Customer & Account</div></a>
</div>

Composable for customer password management.





## Types


```ts
export function useCustomerPassword(): UseCustomerPasswordReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCustomerPassword/useCustomerPassword.ts#L28" target="_blank">source code</a>



```ts
export type UseCustomerPasswordReturn = {
  /**
   * Change customer's current password
   */
  updatePassword(
    updatePasswordData: operations["changePassword post /account/change-password"]["body"],
  ): Promise<
    operations["changePassword post /account/change-password"]["response"]
  >;
  /**
   * Reset customer's password
   */
  resetPassword(
    resetPasswordData: operations["sendRecoveryMail post /account/recovery-password"]["body"],
  ): Promise<
    operations["sendRecoveryMail post /account/recovery-password"]["response"]
  >;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCustomerPassword/useCustomerPassword.ts#L4" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
