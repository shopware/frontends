import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";

interface UseB2bEmployeeManagementRoles {
  createSingleRole: (
    params: operations["createRole post /role/create"]["body"],
  ) => Promise<operations["createRole post /role/create"]["response"]>;
  getRoles: () => Promise<operations["readRoles get /role"]["response"]>;
  getRoleById: (
    roleId: string,
  ) => Promise<operations["readRole get /role/{id}"]["response"]>;
  getPermissions: () => Promise<
    operations["readPermissions get /permission"]["response"]
  >;
  updateRole: (
    roleId: string,
    params: operations["updateRole patch /role/{id}"]["body"],
  ) => Promise<operations["updateRole patch /role/{id}"]["response"]>;
  deleteRole: (
    roleId: string,
  ) => Promise<operations["deleteRole delete /role/{id}"]["response"]>;
  updateDefaultRoleId: (
    params: operations["updateDefaultRoleId post /role/default"]["body"],
  ) => Promise<
    operations["updateDefaultRoleId post /role/default"]["response"]
  >;
  setDefaultRole: (
    params: operations["updateDefaultRoleId post /role/default"]["body"],
  ) => Promise<
    operations["updateDefaultRoleId post /role/default"]["response"]
  >;
}

/**
 * More info about the feature https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components#employee-management
 *
 * @returns {UseB2bEmployeeManagementRoles}
 */
export function useB2bEmployeeManagementRoles(): UseB2bEmployeeManagementRoles {
  const { apiClient } = useShopwareContext();

  const createSingleRole = async (
    params: operations["createRole post /role/create"]["body"],
  ) => {
    const response = await apiClient.invoke("createRole post /role/create", {
      body: {
        ...params,
      },
    });

    return response.data;
  };

  const getRoles = async () => {
    const response = await apiClient.invoke("readRoles get /role");
    return response.data;
  };

  const getRoleById = async (roleId: string) => {
    const response = await apiClient.invoke("readRole get /role/{id}", {
      pathParams: {
        id: roleId,
      },
    });
    return response.data;
  };

  const getPermissions = async () => {
    const response = await apiClient.invoke("readPermissions get /permission");
    return response.data;
  };

  const updateRole = async (
    roleId: string,
    params: operations["updateRole patch /role/{id}"]["body"],
  ) => {
    const response = await apiClient.invoke("updateRole patch /role/{id}", {
      pathParams: {
        id: roleId,
      },
      body: {
        ...params,
      },
    });
    return response.data;
  };

  const deleteRole = async (roleId: string) => {
    const response = await apiClient.invoke("deleteRole delete /role/{id}", {
      pathParams: {
        id: roleId,
      },
    });
    return response.data;
  };

  const updateDefaultRoleId = async (
    params: operations["updateDefaultRoleId post /role/default"]["body"],
  ) => {
    const response = await apiClient.invoke(
      "updateDefaultRoleId post /role/default",
      {
        body: {
          ...params,
        },
      },
    );
    return response.data;
  };
  const setDefaultRole = async (
    params: operations["updateDefaultRoleId post /role/default"]["body"],
  ) => {
    const response = await apiClient.invoke(
      "updateDefaultRoleId post /role/default",
      {
        body: {
          ...params,
        },
      },
    );
    return response.data;
  };

  return {
    createSingleRole,
    getRoles,
    getRoleById,
    getPermissions,
    updateRole,
    deleteRole,
    updateDefaultRoleId,
    setDefaultRole,
  };
}
