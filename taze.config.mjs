import { defineConfig } from "taze";

export default defineConfig({
  recursive: true,
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: true,
  // run `npm install` or `yarn install` right after bumping
  install: false,
  mode: "minor",
  // override with different bumping mode for each package
  packageMode: {
    axios: "ignore",
    "@types/node": "ignore",
    vitepress: "ignore",
    /**
     * until https://github.com/nuxt-modules/i18n/issues/2215 is resolved
     */
    "@nuxtjs/i18n": "ignore",
  },
});
