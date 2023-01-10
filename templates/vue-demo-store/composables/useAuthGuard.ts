/**
 * Guard for checking if the user is authenticated.
 * By default it redirects to homepage, but you can pass destination as an argument or edit this composable to suit your needs.
 */
export function useAuthGuardRedirection(params?: { to: "string" }) {
  const { isLoggedIn } = useUser();
  const router = useRouter();
  const { pushInfo } = useNotifications();

  watch(
    isLoggedIn,
    (isLoggedIn) => {
      if (!isLoggedIn) {
        router.push(params?.to || "/");
        pushInfo(`You're logged out.`);
      }
    },
    {
      immediate: true,
    }
  );
}
