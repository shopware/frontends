/**
 * Validates that the required environment variables are set for admin API authentication.
 *
 * If `SHOPWARE_ADMIN_CLIENT_SECRET` or `SHOPWARE_ADMIN_CLIENT_ID` is present,
 * assumes client_credentials grant type and requires `SHOPWARE_ADMIN_CLIENT_SECRET`.
 *
 * Otherwise, assumes password grant type and requires `SHOPWARE_ADMIN_USERNAME`
 * and `SHOPWARE_ADMIN_PASSWORD`.
 *
 * @returns array of missing environment variable names
 */
export function validateAdminEnvVars(
  env: Record<string, string | undefined>,
): string[] {
  const hasClientSecret = !!env.SHOPWARE_ADMIN_CLIENT_SECRET?.trim();
  const hasClientId = !!env.SHOPWARE_ADMIN_CLIENT_ID?.trim();

  if (hasClientSecret || hasClientId) {
    // client_credentials flow — both CLIENT_ID and CLIENT_SECRET are required
    const missing: string[] = [];
    if (!hasClientId) {
      missing.push("SHOPWARE_ADMIN_CLIENT_ID");
    }
    if (!hasClientSecret) {
      missing.push("SHOPWARE_ADMIN_CLIENT_SECRET");
    }
    return missing;
  }

  // password flow — both username and password are required
  const missing: string[] = [];
  if (!env.SHOPWARE_ADMIN_USERNAME) {
    missing.push("SHOPWARE_ADMIN_USERNAME");
  }
  if (!env.SHOPWARE_ADMIN_PASSWORD) {
    missing.push("SHOPWARE_ADMIN_PASSWORD");
  }
  return missing;
}
