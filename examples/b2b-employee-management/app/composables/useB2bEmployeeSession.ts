import { type UnknownRecord, isRecord } from "~/utils/records";

const getRecord = (
  source: UnknownRecord | undefined,
  key: string,
): UnknownRecord | undefined => {
  const value = source?.[key];
  return isRecord(value) ? value : undefined;
};

const getString = (
  source: UnknownRecord | undefined,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
};

export const useB2bEmployeeSession = () => {
  const { isLoggedIn, logout, user } = useUser();
  const { sessionContext } = useSessionContext();

  const isLoggingOut = ref(false);

  const b2bEmployee = computed(() => {
    const context = sessionContext.value as UnknownRecord | undefined;
    const extensions = getRecord(context, "extensions");
    return getRecord(extensions, "b2bEmployee");
  });

  const b2bEmployeeExtensions = computed(() =>
    getRecord(b2bEmployee.value, "extensions"),
  );

  const b2bRole = computed(
    () =>
      getRecord(b2bEmployee.value, "role") ||
      getRecord(b2bEmployeeExtensions.value, "role"),
  );

  const b2bOrganization = computed(
    () =>
      getRecord(b2bEmployee.value, "organization") ||
      getRecord(b2bEmployeeExtensions.value, "organization"),
  );

  const getEmployeeString = (keys: string[]): string | undefined =>
    getString(b2bEmployee.value, keys) ||
    getString(b2bEmployeeExtensions.value, keys);

  const isB2bEmployeeSession = computed(() => Boolean(b2bEmployee.value));

  const currentUserName = computed(() => {
    const employeeFirstName = getEmployeeString(["firstName"]);
    const employeeLastName = getEmployeeString(["lastName"]);
    const customer = user.value;

    return (
      [employeeFirstName, employeeLastName].filter(Boolean).join(" ") ||
      [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
      "Logged-in customer"
    );
  });

  const currentUserEmail = computed(
    () => getEmployeeString(["email"]) || user.value?.email,
  );

  const currentUserRole = computed(
    () => getString(b2bRole.value, ["name"]) || "No B2B role in context",
  );

  const currentUserStatus = computed(
    () => getEmployeeString(["status"]) || "Customer session",
  );

  const currentOrganization = computed(
    () =>
      getString(b2bOrganization.value, ["name", "id"]) ||
      getString(getRecord(b2bOrganization.value, "data"), ["id"]) ||
      "No organization extension in context",
  );

  const handleLogout = async () => {
    isLoggingOut.value = true;
    try {
      await logout();
    } finally {
      isLoggingOut.value = false;
    }
  };

  return {
    currentOrganization,
    currentUserEmail,
    currentUserName,
    currentUserRole,
    currentUserStatus,
    handleLogout,
    isB2bEmployeeSession,
    isLoggedIn,
    isLoggingOut,
  };
};
