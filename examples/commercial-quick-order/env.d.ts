/// <reference types="vite/client" />
/// <reference types="@types/web-bluetooth" />
/// <reference path="../vueuse-temporal.d.ts" />

interface ImportMetaEnv {
  readonly VITE_SHOPWARE_API: string;
  readonly VITE_SHOPWARE_ACCESS_KEY: string;
  readonly VITE_TEST_LOGIN_EMAIL: string;
  readonly VITE_TEST_LOGIN_PASSWORD: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
