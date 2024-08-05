import { callWithNuxt } from "#app";
import {
  navigateTo,
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  useUser,
} from "#imports";

type MiddlewareMeta =
  | boolean
  | {
      /** Whether to only allow unauthenticated users to access this page.
       *
       * Authenticated users will be redirected to `/` or the route defined in `navigateAuthenticatedTo`
       *
       * @default undefined
       */
      unauthenticatedOnly?: boolean;
      /** Where to redirect authenticated users if `unauthenticatedOnly` is set to true
       *
       * @default undefined
       */
      navigateAuthenticatedTo?: string;
      /** Where to redirect unauthenticated users if this page is protected
       *
       * @default undefined
       */
      navigateUnauthenticatedTo?: string;
    };

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();

  console.warn(
    "auth middleware",
    (await nuxtApp.$shopwareApiInstance.invoke("readContext get /context")).data
      .customer,
  );
});
