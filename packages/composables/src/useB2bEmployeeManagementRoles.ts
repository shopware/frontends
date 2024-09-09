import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";

// interface UseB2bEmployeeManagementRoles {
//   createSingleRole: (
//     params: operations["createRole post /role/create"]["body"],
//   ) => Promise<operations["createRole post /role/create"]["response"]>;
//   getRoles: () => Promise<operations["readRoles get /role"]["response"]>;
//   getRoleById: (
//     roleId: string,
//   ) => Promise<operations["readRole get /role/{id}"]["response"]>;
//   getPermissions: () => Promise<
//     operations["readPermissions get /role/permissions"]["response"]
//   >;
//   setDefaultRole: (
//     roleId: string,
//   ) => Promise<
//     operations["updateDefaultRoleId post /role/default"]["response"]
//   >;
// }

/**
 * More info about the feature https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components#employee-management
 *
 * @returns
 */
export function useB2bEmployeeManagementRoles() {
  const { apiClient } = useShopwareContext();

  const createSingleRole = (
    params: operations["createRole post /role/create"]["body"],
  ) => {
    return apiClient.invoke("createRole post /role/create", {
      body: {
        ...params,
      },
    });
  };

  const getRoles = () => {
    return apiClient.invoke("readRoles get /role");
  };

  const getRoleById = (roleId: string) => {
    return apiClient.invoke("readRole get /role/{id}", {
      pathParams: {
        id: roleId,
      },
    });
  };

  const getPermissions = () => {
    return apiClient.invoke("readPermissions get /role/permissions");
  };

  const setDefaultRole = (roleId: string) => {
    return apiClient.invoke("updateDefaultRoleId post /role/default", {
      body: {
        id: roleId,
      },
    });
  };

  return {
    createSingleRole,
    getRoles,
    getRoleById,
    getPermissions,
    setDefaultRole,
  };
}
