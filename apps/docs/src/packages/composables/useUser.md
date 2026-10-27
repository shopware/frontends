# useUser

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#customer--account"><div class="bg-red">Customer & Account</div></a>
</div>

Composable for user management.





## Types


```ts
export function useUser(): UseUserReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useUser/useUser.ts#L133" target="_blank">source code</a>



```ts
export type UseUserReturn = {
  /**
   * Logs-in user with given credentials
   * @param params - username and password
   *
   * @see https://github.com/shopware/frontends/issues/112 if login fails due to missing context token
   */
  login(params: { username: string; password: string }): Promise<void>;
  /**
   * Registers the user for given credentials
   * @param params {@link CustomerRegistrationParams}
   * @returns {@link Customer} object on success
   */
  register(
    params: Omit<
      operations["register post /account/register"]["body"],
      "storefrontUrl"
    >,
  ): Promise<Schemas["Customer"]>;
  /**
   * Whole {@link Customer} object
   */
  user: ComputedRef<Schemas["Customer"] | undefined>;
  /**
   * Indicates if the user is logged in
   */
  isLoggedIn: ComputedRef<boolean>;
  /**
   * Indicates if the user is logged in as a customer (not a guest)
   */
  isCustomerSession: ComputedRef<boolean>;
  /**
   * Indicates if the user is logged in as a guest
   */
  isGuestSession: ComputedRef<boolean>;
  /**
   * {@link Country} of the user
   */
  country: Ref<Schemas["Country"] | null>;
  /**
   * {@link Salutation} of the user
   */
  salutation: Ref<Schemas["Salutation"] | null>;
  /**
   * Default billing address id
   */
  defaultBillingAddressId: ComputedRef<string | null>;
  /**
   * Default shipping address id
   */
  defaultShippingAddressId: ComputedRef<string | null>;
  /**
   * Fetches the user data from the API
   */
  refreshUser(params?: Schemas["Criteria"]): Promise<Schemas["Customer"]>;
  /**
   * Logs out the user
   */
  logout(): Promise<
    operations["logoutCustomer post /account/logout"]["response"]
  >;
  /**
   * Loads the {@link Country} of the user
   */
  loadCountry(
    countryId: string,
  ): Promise<operations["readCountry post /country"]["response"]>;
  /**
   * Loads the {@link Salutation} for given id
   */
  loadSalutation(
    salutationId: string,
  ): Promise<operations["readSalutation post /salutation"]["response"]>;
  /**
   * Updates the user profile data
   * @param personals {@link RequestParameters<'changeProfile'>}
   * @returns
   */
  updatePersonalInfo(
    personals: operations["changeProfile post /account/change-profile"]["body"],
  ): Promise<void>;
  /**
   * Updates the user email
   * @param updateEmailData - {@link RequestParameters<'changeEmail'>}
   * @returns
   */
  updateEmail(
    updateEmailData: operations["changeEmail post /account/change-email"]["body"],
  ): Promise<void>;
  /**
   * @deprecated API endpoint is removed in Shopware 6.7
   *
   * Sets the default payment method for given id
   * @param paymentMethodId
   * @returns
   */
  setDefaultPaymentMethod(paymentMethodId: string): Promise<void>;
  /**
   * Default payment method for the user
   */
  userDefaultPaymentMethod: ComputedRef<
    Schemas["PaymentMethod"]["translated"] | null
  >;
  /**
   * Default billing address for the user
   */
  userDefaultBillingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
  /**
   * Default shipping address for the user
   */
  userDefaultShippingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useUser/useUser.ts#L15" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
