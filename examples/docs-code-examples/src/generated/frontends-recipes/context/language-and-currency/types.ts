import type { Schemas, operations } from "#shopware";

type LanguagesResponse = operations["readLanguages post /language"]["response"];
type CurrenciesResponse = operations["readCurrency post /currency"]["response"];
type ContextPatchResponse =
  operations["updateContext patch /context"]["response"];
type Language = Schemas["Language"];
type Currency = Schemas["Currency"];
