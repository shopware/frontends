import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";

interface UseB2bEmployeeManagement {
  getEmployees: () => Promise<
    operations["readEmployeesPOST post /employee"]["response"]
  >;
  createSingleEmployee: (
    params: operations["createEmployee post /employee/create"]["body"],
    languageId: string,
  ) => Promise<operations["createEmployee post /employee/create"]["response"]>;
  getEmployeeById: (
    employeeId: string,
  ) => Promise<operations["readEmployee get /employee/{id}"]["response"]>;
  reinviteEmployee: (
    employeeId: string,
  ) => Promise<
    operations["reinviteEmployee post /employee/reinvite/{id}"]["response"]
  >;
  deleteEmployee: (
    employeeId: string,
  ) => Promise<operations["deleteEmployee delete /employee/{id}"]["response"]>;
}

/**
 * More info about the feature https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components#employee-management
 * @returns
 */
export function useB2bEmployeeManagement(): UseB2bEmployeeManagement {
  const { apiClient } = useShopwareContext();

  const getEmployees = async () => {
    const response = await apiClient.invoke("readEmployeesPOST post /employee");
    return response.data;
  };

  const createSingleEmployee = async (
    params: operations["createEmployee post /employee/create"]["body"],
    languageId: string,
  ) => {
    const response = await apiClient.invoke(
      "createEmployee post /employee/create",
      {
        body: {
          ...params,
          languageId,
        },
      },
    );
    return response.data;
  };

  const getEmployeeById = async (employeeId: string) => {
    const response = await apiClient.invoke("readEmployee get /employee/{id}", {
      pathParams: {
        id: employeeId,
      },
    });
    return response.data;
  };

  /**
   * @toDo add storefornt url
   *
   * @param employeeId
   * @returns
   */
  const reinviteEmployee = async (employeeId: string) => {
    const response = await apiClient.invoke(
      "reinviteEmployee post /employee/reinvite/{id}",
      {
        body: {},
        pathParams: {
          id: employeeId,
        },
      },
    );

    return response.data;
  };

  const deleteEmployee = async (employeeId: string) => {
    const response = await apiClient.invoke(
      "deleteEmployee delete /employee/{id}",
      {
        pathParams: {
          id: employeeId,
        },
      },
    );

    return response.data;
  };

  return {
    getEmployees,
    createSingleEmployee,
    getEmployeeById,
    reinviteEmployee,
    deleteEmployee,
  };
}
