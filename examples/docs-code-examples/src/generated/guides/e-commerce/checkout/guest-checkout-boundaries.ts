const { logout } = useUser();

try {
  await logout();
} catch (error) {
  // Keep the user on a recoverable state instead of reusing the old guest.
  console.error("[Checkout][logout]", error);
}
