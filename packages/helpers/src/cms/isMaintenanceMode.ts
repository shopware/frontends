export function isMaintenanceMode<
  T extends {
    code?: string;
  },
>(errors: [T]): boolean {
  return (
    !!errors.find((element) => {
      return (
        element.code === "FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE" ??
        false
      );
    }) ?? false
  );
}
