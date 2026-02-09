import initUnocssRuntime from "@unocss/runtime";
import { presetWind3 } from "unocss";
import { defineNuxtPlugin, useAppConfig } from "#imports";
import unoConfig from "../../uno.config";

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();
  if (!appConfig.unocssRuntime) return;

  initUnocssRuntime({
    defaults: {
      theme: unoConfig.theme,
      presets: [presetWind3()],
    },
  });
});
