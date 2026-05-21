export type ExampleApiError = {
  code?: string;
  detail?: string;
  status?: string;
  title?: string;
};

type ErrorContainer = {
  data?: unknown;
  details?: unknown;
  errors?: unknown;
  response?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isApiError = (value: unknown): value is ExampleApiError =>
  isRecord(value) &&
  ["code", "detail", "status", "title"].some(
    (key) => typeof value[key] === "string",
  );

const getErrors = (value: unknown): ExampleApiError[] => {
  if (!isRecord(value) || !Array.isArray(value.errors)) {
    return [];
  }

  return value.errors.filter(isApiError);
};

export const extractApiErrors = (error: unknown): ExampleApiError[] => {
  if (!isRecord(error)) {
    return [];
  }

  const container = error as ErrorContainer;

  return [
    ...getErrors(container),
    ...getErrors(container.details),
    ...getErrors(container.data),
    ...getErrors(container.response),
    ...getErrors(
      isRecord(container.response) ? container.response._data : undefined,
    ),
  ];
};

export const getMissingPermissions = (errors: ExampleApiError[]): string[] => {
  const permissions = new Set<string>();

  for (const error of errors) {
    if (error.code !== "B2B__EMPLOYEE_MISSING_PERMISSIONS" || !error.detail) {
      continue;
    }

    const [, permissionList] = error.detail.split(
      "Employee is missing permissions:",
    );
    for (const permission of permissionList?.split(",") || []) {
      const permissionName = permission.trim();

      if (permissionName) {
        permissions.add(permissionName);
      }
    }
  }

  return Array.from(permissions);
};
