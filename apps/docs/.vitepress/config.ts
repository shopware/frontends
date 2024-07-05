import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";
import nav from "./navigation";
import { SearchPlugin } from "vitepress-plugin-search";
import { CmsBaseReference } from "./theme/typer/cms-base-plugin";
import { ReadmeBasedReference } from "./theme/typer/plugin";

import { sidebar } from "./sidebar";

interface ThemeConfigExtended extends ThemeConfig {
  ai: {
    endpoint: string;
  };
}

export default defineConfigWithTheme<ThemeConfigExtended>({
  extends: baseConfig,
  lang: "en-US",
  title: "Shopware Frontends",
  description: "Documentation for Shopware developers",
  srcDir: "src",
  // srcExclude: ["tutorial/**/description.md"], In case we need something to be excluded
  scrollOffset: "header",
  ignoreDeadLinks: true, // remove once MR #294 is merged
  rewrites: {
    "installation.md": "getting-started/templates/demo-store-template",
    "installation.html": "getting-started/templates/demo-store-template",
  },
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
      { name: "og:site_name", content: "Shopware Frontends - Documentation" },
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
      { name: "og:site_name", content: "Shopware Frontends - Documentation" },
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
    sidebar: sidebar,
    algolia: {
      indexName: "beta-developer-shopware",
      appId: "J1Y01X9HGM",
      apiKey: "711e1cadf66a3957aaf183a58aad12a7",
    },
    ai: {
      endpoint: "",
    },
  },
  vite: {
    plugins: [SearchPlugin(), ReadmeBasedReference(), CmsBaseReference()],
  },
});
