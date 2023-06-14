import transformerDirective from "@unocss/transformer-directives";
import type { PluginOption } from "vite";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
        devStorefrontUrl: "",
      },
    },
  },
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  debug: true,
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware-pwa/nuxt3-module",
    "@shopware-pwa/cms-base",
    "@nuxt/devtools",
    "@nuxtjs/i18n",
  ],
  // components: true,
  components: {
    dirs: ["~/components"],
    global: true,
  },
  vueuse: {
    ssrHandlers: true,
  },
  // Unocss bug fix https://github.com/nuxt/framework/issues/7623
  experimental: {
    inlineSSRStyles: false,
  },
  nitro: {
    compressPublicAssets: true,
  },
  unocss: {
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,
    preflight: true,
    transformers: [transformerDirective()],
    theme: {
      extend: {
        width: "width",
        height: "height",
      },
      colors: {
        brand: {
          primary: "#189eff",
          light: "#5ebbff",
          dark: "#0081df",
        },
      },
    },
  },
  router: {
    options: {
      linkExactActiveClass: "text-brand-primary",
    },
  },
  i18n: {
    strategy: "no_prefix",
    langDir: "i18n/src/",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        file: "en-US.ts",
      },
    ],
  },
  vite: {
    plugins: [VueDisableInputsBeforeMount()],
  },
});

// excuse me, just for tests
function VueDisableInputsBeforeMount(): PluginOption {
  return {
    name: "vite-vue-disable-inputs-before-mount",
    enforce: "pre",
    transform(code, id) {
      return null;
      let newCode = code;

      if (id.endsWith(".vue")) {
        if (newCode.includes("<select")) {
          if (newCode.includes(":disabled=")) {
            return null;
          }
          console.warn("transform", id.endsWith("vue"), id);
          newCode = newCode.replaceAll(
            "</script>",
            `
              const isDisabled = ref(typeof onMounted !=="undefined" ? true : false);
              if(typeof onMounted !=="undefined") {
                onMounted(() => {
                  console.warn('enabling an input', '${id}');
                  isDisabled.value = false;

                });
              }

              </script>
              `
          );
          // newCode = newCode.replaceAll(
          //   "<button",
          //   '<button :disabled="isDisabled" '
          // );
          newCode = newCode.replaceAll(
            "<select",
            '<select :disabled="isDisabled" '
          );
        }

        return { code: newCode, id };
      }

      return null;
    },
  };
}
