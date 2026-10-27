# useInternationalization

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#context--language"><div class="bg-red">Context & Language</div></a>
</div>

Composable for internationalization management.





## Types


```ts
export function useInternationalization(
  pathResolver?: (path: string) => string,
): UseInternationalizationReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useInternationalization/useInternationalization.ts#L81" target="_blank">source code</a>



```ts
export type UseInternationalizationReturn = {
  /**
   * StorefrontUrl is needed to specify language of emails
   *
   *  @returns {string} storefront URL
   */
  getStorefrontUrl(): string;
  /**
   * Get available languages from backend
   *
   * @returns {Promise<operations['readLanguages post /language']['body']>} list of languages
   */
  getAvailableLanguages(): Promise<
    operations["readLanguages post /language"]["response"]
  >;
  /**
   * Change current language
   *
   * @param {string} languageId
   * @returns {Promise<Schemas['ContextTokenResponse']>} context object
   */
  changeLanguage(
    languageId: string,
  ): Promise<operations["updateContext patch /context"]["response"]>;
  /**
   * Get language code from backend language id
   *
   * @param {string} languageId
   * @returns {string} language code
   */
  getLanguageCodeFromId(languageId: string): string;
  /**
   * Get backend language id from language code
   *
   * @param {string} languageCode
   * @returns {string} language
   */
  getLanguageIdFromCode(languageCode: string): string;
  /**
   * Replace to dev url if it is set
   *
   * @param {string} url
   * @returns {string} prefixed url
   */
  replaceToDevStorefront(url: string): string;
  /**
   * List of available languages
   */
  languages: Ref<Schemas["Language"][]>;
  /**
   * Currently used language
   */
  currentLanguage: Ref<string>;
  /**
   * Current prefix from the context
   */
  currentPrefix: Ref<string>;
  /**
   * Add prefix to the Url
   * @param {string | RouteObject} link
   */
  formatLink(link: string | RouteObject): string | RouteObject;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useInternationalization/useInternationalization.ts#L7" target="_blank">source code</a>

```ts
export type RouteObject = {
  path: string;
  [key: string]: unknown;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useInternationalization/useInternationalization.ts#L71" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
