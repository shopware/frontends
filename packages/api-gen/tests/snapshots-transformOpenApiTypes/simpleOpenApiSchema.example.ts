/** OneOf type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
type OneOf<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
    ? OneOf<[XOR<A, B>, ...Rest]>
    : never;

type GenericRecord =
  | never
  | null
  | string
  | string[]
  | number
  | { [key: string]: GenericRecord };

export type paths = {
  "/account/address": {
    /**
     * Create a new address for a customer
     * Creates a new address for a customer.
     */
    post: operations["createCustomerAddress"];
  };
  "/account/address/{addressId}": {
    /**
     * Delete an address of a customer
     * Delete an address of customer.
     *
     *     Only addresses which are not set as default addresses for shipping or billing can be deleted. You can check the current default addresses of your customer using the profile information endpoint and change them using the default address endpoint.
     *
     *     **A customer must have at least one address (which can be used for shipping and billing).**
     *
     *     An automatic fallback is not applied.
     */
    delete: operations["deleteCustomerAddress"];
    /**
     * Modify an address of a customer
     * Modifies an existing address of a customer.
     */
    patch: operations["updateCustomerAddress"];
  };
};

export type webhooks = Record<string, never>;
export type components = {
  schemas: {
    /** Added since version: 6.0.0.0 */
    Country: {
      active?: boolean;
      addressFormat: GenericRecord;
      advancedPostalCodePattern?: string;
      checkAdvancedPostalCodePattern?: boolean;
      checkPostalCodePattern?: boolean;
      checkVatIdPattern?: boolean;
      companyTax?: {
        /** Format: float */
        amount: number;
        currencyId: string;
        enabled: boolean;
      };
      /** Format: date-time */
      createdAt: string;
      customerTax?: {
        /** Format: float */
        amount: number;
        currencyId: string;
        enabled: boolean;
      };
      customFields?: GenericRecord;
      defaultPostalCodePattern?: string;
      displayStateInRegistration?: boolean;
      forceStateInRegistration?: boolean;
      id?: string;
      iso?: string;
      iso3?: string;
      name: string;
      /** Format: int64 */
      position?: number;
      postalCodeRequired?: boolean;
      shippingAvailable?: boolean;
      states?: components["schemas"]["CountryState"][];
      translated?: {
        advancedPostalCodePattern?: string;
        defaultPostalCodePattern?: string;
        iso?: string;
        iso3?: string;
        name?: string;
        vatIdPattern?: string;
      };
      /** Format: date-time */
      updatedAt?: string;
      vatIdPattern?: string;
      vatIdRequired?: boolean;
    };
    /** Added since version: 6.0.0.0 */
    CountryState: {
      active?: boolean;
      countryId: string;
      /** Format: date-time */
      createdAt: string;
      customFields?: GenericRecord;
      id?: string;
      name: string;
      /** Format: int64 */
      position?: number;
      shortCode: string;
      translated?: {
        countryId?: string;
        name?: string;
        shortCode?: string;
      };
      /** Format: date-time */
      updatedAt?: string;
    };
    CustomerAddress: {
      additionalAddressLine1?: string;
      additionalAddressLine2?: string;
      city: string;
      company?: string;
      country?: components["schemas"]["Country"];
      countryId: string;
      countryState?: components["schemas"]["CountryState"];
      countryStateId?: string;
      /** Format: date-time */
      createdAt: string;
      customerId: string;
      customFields?: GenericRecord;
      department?: string;
      firstName: string;
      id?: string;
      lastName: string;
      phoneNumber?: string;
      salutation?: components["schemas"]["Salutation"];
      salutationId?: string;
      street: string;
      title?: string;
      /** Format: date-time */
      updatedAt?: string;
      zipcode?: string;
    };
    /** Added since version: 6.0.0.0 */
    Salutation: {
      /** Format: date-time */
      createdAt: string;
      customFields?: GenericRecord;
      displayName: string;
      id?: string;
      letterName: string;
      salutationKey: string;
      translated?: {
        displayName?: string;
        letterName?: string;
        salutationKey?: string;
      };
      /** Format: date-time */
      updatedAt?: string;
    };
    failure: {
      errors: components["schemas"]["error"][];
      links?: components["schemas"]["links"];
      meta?: components["schemas"]["meta"];
    };
    error: {
      /** An application-specific error code, expressed as a string value. */
      code?: string;
      /** A human-readable description of the problem. */
      description?: string;
      /** A human-readable explanation specific to this occurrence of the problem. */
      detail?: string;
      /** A unique identifier for this particular occurrence of the problem. */
      id?: string;
      links?: components["schemas"]["links"];
      meta?: components["schemas"]["meta"];
      source?: {
        /** A string indicating which query parameter caused the error. */
        parameter?: string;
        /** A JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute]. */
        pointer?: string;
      };
      /** The HTTP status code applicable to this problem, expressed as a string value. */
      status?: string;
      /** A short, human-readable summary of the problem. It **SHOULD NOT** change from occurrence to occurrence of the problem, except for purposes of localization. */
      title?: string;
    };
    links: GenericRecord;
    /** Non-standard meta-information that can not be represented as an attribute or relationship. */
    meta: GenericRecord;
  };
  responses: {
    /** No Content */
    204: {
      content: never;
    };
    /** Bad Request */
    400: {
      content: {
        "application/json": components["schemas"]["failure"];
        "application/vnd.api+json": components["schemas"]["failure"];
      };
    };
    /** Unauthorized */
    401: {
      content: {
        "application/json": components["schemas"]["failure"];
        "application/vnd.api+json": components["schemas"]["failure"];
      };
    };
    /** Forbidden */
    403: {
      content: {
        "application/json": components["schemas"]["failure"];
        "application/vnd.api+json": components["schemas"]["failure"];
      };
    };
    /** Not Found */
    404: {
      content: {
        "application/json": components["schemas"]["failure"];
        "application/vnd.api+json": components["schemas"]["failure"];
      };
    };
    /** Returns the context token. Use that as your `sw-context-token` header for subsequent requests. Redirect if getRedirectUrl is set. */
    ContextTokenResponse: {
      headers: {
        /** Contains sw-context-token value */
        "sw-context-token"?: string;
      };
      content: {
        "application/json": {
          /**
           * @deprecated
           * Deprecated since v6.6.0.0. Please retrieve the context token from the response header instead.
           */
          contextToken?: string;
          /** Define the URL which browser will be redirected to */
          redirectUrl?: string;
        };
      };
    };
  };
  parameters: {
    /** Accepted response content types */
    accept: string;
    /** Content type of the request */
    contentType: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = {
  /**
   * Create a new address for a customer
   * Creates a new address for a customer.
   */
  createCustomerAddress: {
    requestBody?: {
      content: {
        "application/json": components["schemas"]["CustomerAddress"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["CustomerAddress"];
        };
      };
    };
  };
  /**
   * Delete an address of a customer
   * Delete an address of customer.
   *
   *     Only addresses which are not set as default addresses for shipping or billing can be deleted. You can check the current default addresses of your customer using the profile information endpoint and change them using the default address endpoint.
   *
   *     **A customer must have at least one address (which can be used for shipping and billing).**
   *
   *     An automatic fallback is not applied.
   */
  deleteCustomerAddress: {
    parameters: {
      path: {
        /** ID of the address to be deleted. */
        addressId: string;
      };
    };
    responses: {
      /** No Content response, when the address has been deleted */
      204: {
        content: never;
      };
      /** Response containing a list of errors, most likely due to the address being in use */
      400: {
        content: never;
      };
    };
  };
  /**
   * Modify an address of a customer
   * Modifies an existing address of a customer.
   */
  updateCustomerAddress: {
    parameters: {
      path: {
        /** Address ID */
        addressId: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["CustomerAddress"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["CustomerAddress"];
        };
      };
    };
  };
};

export type operationPaths =
  | "createCustomerAddress post /account/address"
  | "updateCustomerAddress patch /account/address/{addressId}"
  | "deleteCustomerAddress delete /account/address/{addressId}";
