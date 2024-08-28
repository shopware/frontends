import { describe, expect, it } from "vitest";
import { createAPIClient } from "../createAPIClient";
import type { operations } from "../../api-types/storeApiTypes";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

describe("updateSessionContext", () => {
  describe("update session currency", () => {
    it("should update session currency", async () => {
      const apiInstance = createAPIClient<operations>({
        baseURL,
        accessToken,
      });

      const sessionResponse = await apiInstance.invoke(
        "readContext get /context",
      );

      const currentIsoCode = sessionResponse.data.currency?.isoCode;
      expect(currentIsoCode).toEqual("EUR");

      const availableCurrencies = await apiInstance.invoke(
        "readCurrency post /currency",
      );
      const differentCurrency = availableCurrencies.data.find(
        (currency) => currency.isoCode === "PLN",
      );

      await apiInstance.invoke("updateContext patch /context", {
        body: {
          currencyId: differentCurrency?.id,
        },
      });

      const updatedSessionContext = await apiInstance.invoke(
        "readContext get /context",
      );
      const updatedCurrencyIsoCode =
        updatedSessionContext.data.currency?.isoCode;
      expect(updatedCurrencyIsoCode).toEqual("PLN");
    });

    it("should fetch product with changed currency after session update", async () => {
      const apiInstance = createAPIClient<operations>({
        baseURL,
        accessToken,
      });

      const sessionResponse = await apiInstance.invoke(
        "readContext get /context",
      );

      const currentIsoCode = sessionResponse.data.currency?.isoCode;
      expect(currentIsoCode).toEqual("EUR");

      const firstProductResponse = await apiInstance.invoke(
        "readProduct post /product",
        {
          body: {
            ids: ["47b8141e5d8b4aceb25014367e955da3"],
          },
        },
      );
      const firstProductPrice =
        firstProductResponse.data.elements[0].calculatedPrice.unitPrice;
      expect(firstProductPrice).toBeGreaterThan(0);

      const availableCurrencies = await apiInstance.invoke(
        "readCurrency post /currency",
      );
      const differentCurrency = availableCurrencies.data.find(
        (currency) => currency.isoCode === "PLN",
      );
      await apiInstance.invoke("updateContext patch /context", {
        body: {
          currencyId: differentCurrency?.id,
        },
      });

      const productResponse = await apiInstance.invoke(
        "readProduct post /product",
        {
          body: {
            ids: ["47b8141e5d8b4aceb25014367e955da3"],
          },
        },
      );
      const newProductPrice =
        productResponse.data.elements[0].calculatedPrice.unitPrice;
      expect(newProductPrice).toBeGreaterThan(0);
      expect(newProductPrice).not.toEqual(firstProductPrice);
    });
  });

  describe("update session language", () => {
    it("should update session language", async () => {
      const apiInstance = createAPIClient<operations>({
        baseURL,
        accessToken,
      });

      const sessionResponse = await apiInstance.invoke(
        "readContext get /context",
      );

      const currentLanguageId =
        sessionResponse.data.context?.languageIdChain?.[0];
      expect(currentLanguageId).toEqual("2fbb5fe2e29a4d70aa5854ce7ce3e20b");

      const availableLanguages = await apiInstance.invoke(
        "readLanguages post /language",
      );

      const differentLanguage = availableLanguages.data.elements.find(
        (language) => language.id !== currentLanguageId,
      );

      await apiInstance.invoke("updateContext patch /context", {
        body: {
          languageId: differentLanguage?.id,
        },
      });

      const updatedSessionContext = await apiInstance.invoke(
        "readContext get /context",
      );
      const updatedLanguageId =
        updatedSessionContext.data.context?.languageIdChain?.[0];
      expect(updatedLanguageId).toEqual(differentLanguage?.id);
    });

    it("should fetch product with changed language after session update", async () => {
      const apiInstance = createAPIClient<operations>({
        baseURL,
        accessToken,
      });

      const sessionResponse = await apiInstance.invoke(
        "readContext get /context",
      );

      const currentLanguageId =
        sessionResponse.data.context?.languageIdChain?.[0];
      expect(currentLanguageId).toEqual("2fbb5fe2e29a4d70aa5854ce7ce3e20b");

      const firstProductResponse = await apiInstance.invoke(
        "readProduct post /product",
        {
          body: {
            ids: ["47b8141e5d8b4aceb25014367e955da3"],
          },
        },
      );
      const firstProductName =
        firstProductResponse.data.elements[0].translated.name;
      expect(firstProductName).not.toBe("");

      const availableLanguages = await apiInstance.invoke(
        "readLanguages post /language",
      );

      const differentLanguage = availableLanguages.data.elements.find(
        (language) => language.name === "Polski",
      );

      await apiInstance.invoke("updateContext patch /context", {
        body: {
          languageId: differentLanguage?.id,
        },
      });

      const productResponse = await apiInstance.invoke(
        "readProduct post /product",
        {
          body: {
            ids: ["47b8141e5d8b4aceb25014367e955da3"],
          },
        },
      );
      const newProductName = productResponse.data.elements[0].translated.name;
      expect(newProductName).not.toBe("");
      expect(newProductName).not.toEqual(firstProductName);
    });
  });
});
