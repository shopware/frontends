import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { CreateLocaleInstanceArgs, MolliePlugin } from "../../types";

export default defineNuxtPlugin({
  name: "mollie-instance",
  enforce: "pre",

  async setup(nuxtApp) {
    if (!window.Mollie) {
      throw Error(
        "mollie-register plugin didn't register required scripts, thus mollie instance cannot be created.",
      );
    }
    const runtimeConfig = useRuntimeConfig();

    const mollieOptions = runtimeConfig?.public?.mollie;

    function createLocaleInstance(
      { profileId, testMode, locale }: CreateLocaleInstanceArgs = {
        profileId: mollieOptions.profileId,
        testMode: mollieOptions.testMode,
        locale: mollieOptions.defaultLocale,
      },
    ) {
      return window.Mollie(profileId || mollieOptions.profileId, {
        locale: locale || mollieOptions.defaultLocale,
        testmode: testMode || mollieOptions.testMode,
      });
    }

    const Mollie: MolliePlugin = {
      mollieInstance: null,
      createMollieInstance: function (args: CreateLocaleInstanceArgs) {
        this.mollieInstance = this.mollieInstance || createLocaleInstance(args);
        return this.mollieInstance;
      },
    };

    nuxtApp.provide("mollie", Mollie);
  },
});
