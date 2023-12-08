/**
 * Guard for checking if the user is authenticated.
 * The check is done on the client side only. If the user is not logged in, the user is redirected to the homepage.
 * If the user is not logged in and a destination is provided, the user is redirected to the destination.
 */
export function useAuthGuardRedirection(params?: { to: string }) {
  const { isLoggedIn } = useUser();
  const router = useRouter();
  const { pushInfo } = useNotifications();

  watch(
    isLoggedIn,
    (isLoggedIn) => {
      if (process.client && !isLoggedIn) {
        if (!params?.to) {
          router.push({ path: "/" });
          pushInfo(
            `Login is required to access this page. You are redirected to the homepage.`,
          );
        }
        if (params?.to) {
          router.push({ path: params.to });
          pushInfo(`You are redirected to ${params.to}.`);
        }
      }
    },
    {
      immediate: true,
    },
  );
}
