import type { Schemas } from "#shopware";

const salutations: Schemas["Salutation"][] = [
  {
    translated: {
      displayName: "Mr.",
      letterName: "Dear Mr.",
      customFields: {},
    },
    createdAt: "2020-08-06T06:23:29.757+00:00",
    updatedAt: "2020-08-06T06:26:29.283+00:00",
    salutationKey: "mr",
    displayName: "Mr.",
    letterName: "Dear Mr.",
    customFields: null,
    id: "d5e543063dd642b48ef94b02d68e5785",
    apiAlias: "salutation",
  },
  {
    translated: {
      displayName: "Mrs.",
      letterName: "Dear Mrs.",
      customFields: {},
    },
    createdAt: "2020-08-06T06:23:29.768+00:00",
    updatedAt: "2020-08-06T06:26:29.267+00:00",
    salutationKey: "mrs",
    displayName: "Mrs.",
    letterName: "Dear Mrs.",
    customFields: null,
    id: "fef89b093c4843af86f26a07d0e81108",
    apiAlias: "salutation",
  },
  {
    translated: {
      displayName: "Not specified",
      letterName: " ",
      customFields: {},
    },
    createdAt: "2020-08-06T06:23:29.780+00:00",
    updatedAt: "2020-08-06T06:26:29.274+00:00",
    salutationKey: "not_specified",
    displayName: "Not specified",
    letterName: " ",
    customFields: null,
    id: "b84038d62c3f4d66b3bc626df7fa949e",
    apiAlias: "salutation",
  },
] as unknown as Schemas["Salutation"][];

export default salutations;
