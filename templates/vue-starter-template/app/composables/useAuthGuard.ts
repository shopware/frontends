/**
 * Guard for checking if the user is authenticated.
 * The check is done on the client side only.
 * If the user is not logged in, they are redirected to the login page
 * with the current path as a `redirect` query parameter.
 */
export function useAuthGuardRedirection() {
  const { isLoggedIn } = useUser();
  const router = useRouter();
  const route = useRoute();
  const localePath = useLocalePath();
  const { formatLink } = useInternationalization(localePath);
  const { pushInfo } = useNotifications();

  watch(
    isLoggedIn,
    (isLoggedIn) => {
      if (import.meta.client && !isLoggedIn) {
        const loginPath = formatLink("/account/login");
        const redirect = encodeURIComponent(route.fullPath);
        router.push(`${loginPath}?redirect=${redirect}`);
        pushInfo(
          "Login is required to access this page. You are redirected to the login page.",
        );
      }
    },
    {
      immediate: true,
    },
  );
}
