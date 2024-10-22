import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import { baseConfig } from "@shopware-docs/vitepress";
import nav from "./navigation";
import { resolve } from "path";
import { sidebar } from "./sidebar";
import sharedConfig from "./config.hub";
import { SearchPlugin } from "vitepress-plugin-search";

interface ThemeConfigExtended extends ThemeConfig {
  ai: {
    endpoint: string;
  };
}

export default defineConfigWithTheme<ThemeConfigExtended>(
  sharedConfig(
    {
      extends: baseConfig.default,
      title: "Shopware Frontends",
      description: "Documentation for Shopware developers",
      srcDir: "src",
      srcExclude: [
        // when symlinked to DevHub
        "**/_source/**",
      ],
      ignoreDeadLinks: true, // remove once MR #294 is merged
      head: [
        [
          "link",
          {
            rel: "icon",
            type: "image/svg+xml",
            href: "/logo-icon.svg",
          },
        ],
        [
          "link",
          {
            rel: "mask-icon",
            type: "image/svg+xml",
            href: "/logo-icon.svg",
          },
        ],
        [
          "link",
          {
            rel: "apple-touch-icon",
            sizes: "57x57",
            href: "/logo-icon-57x57.png",
          },
        ],
        [
          "link",
          {
            rel: "shortcut icon",
            href: "/favicon-16x16.ico",
          },
        ],
        ["meta", { name: "og:type", content: "website" }],
        [
          "meta",
          {
            name: "og:site_name",
            content: "Shopware Frontends - Documentation",
          },
        ],
        ["meta", { name: "og:title", content: "" }],
        [
          "meta",
          {
            name: "og:description",
            content:
              "Shopware Frontends is a framework for building custom, headless storefronts with Shopware 6.",
          },
        ],
        [
          "meta",
          {
            name: "og:site_name",
            content: "Shopware Frontends - Documentation",
          },
        ],
        [
          "meta",
          {
            name: "og:image",
            content:
              "https://user-images.githubusercontent.com/5596960/192812626-03033263-dc5d-42e3-bf5c-b5b738cc48bb.png",
          },
        ],
      ],

      themeConfig: {
        nav,
        sidebar,
        algolia: {
          indexName: "",
          appId: "",
          apiKey: "",
          // searchParameters: {
          //   facetFilters: ["version:v1"],
          // },
        },
        ai: {
          endpoint: "",
        },
        editLink: {
          pattern: "https://github.com/shopware/frontends",
        },
      },

      vite: {
        build: {
          minify: "terser",
          chunkSizeWarningLimit: Infinity,
          ssr: false,
          rollupOptions: {
            output: {
              manualChunks(id) {
                if (id.includes("mermaid")) {
                  return "mermaid";
                }
              },
            },
          },
        },
        plugins: [SearchPlugin()],
        server: {
          watch: {
            ignored: (p) => {
              // added to next version of baseConfig
              return p.includes("_source") || p.includes("node_modules");
            },
          },
        },
        resolve: {
          alias: {
            "@node_modules": resolve(process.cwd(), "node_modules"),
            "../composables/edit-link": resolve(
              __dirname,
              "../node_modules/vitepress-shopware-docs/src/shopware/composables/edit-link.ts",
            ),
            "./VPNavBarTitle.vue": resolve(
              __dirname,
              "../node_modules/vitepress-shopware-docs/src/shopware/components/override/VPNavBarTitle.vue",
            ),
            "./VPAlgoliaSearchBox.vue": resolve(
              __dirname,
              "../node_modules/vitepress-shopware-docs/src/shopware/components/override/VPAlgoliaSearchBox.vue",
            ),
            "../NotFound.vue": resolve(
              __dirname,
              "../node_modules/vitepress-shopware-docs/src/shopware/components/override/NotFound.vue",
            ),
            "../SwagRelatedArticles.vue": resolve(
              __dirname,
              "../node_modules/vitepress-shopware-docs/src/shopware/components/SwagRelatedArticles.vue",
            ),
          },
        },
      },
    },
    {
      projectRootDir: `${process.cwd()}/../..`,
      mountPoint: "",
    },
  ),
);
