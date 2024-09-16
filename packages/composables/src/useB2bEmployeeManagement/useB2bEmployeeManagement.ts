import { useShopwareContext } from "#imports";
import type { operations } from "#shopware";

interface UseB2bEmployeeManagement {
  getEmployees: () => Promise<
    operations["readEmployees post /employee"]["response"]
  >;
  createSingleEmployee: (
    params: operations["createEmployee post /employee/create"]["body"],
  ) => Promise<operations["createEmployee post /employee/create"]["response"]>;
  getEmployeeById: (
    employeeId: string,
  ) => Promise<operations["readEmployee post /employee/{id}"]["response"]>;
  reinviteEmployee: (
    employeeId: string,
  ) => Promise<
    operations["reinviteEmployee post /employee/reinvite/{id}"]["response"]
  >;
}

/**
 * More info about the feature https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components#employee-management
 *
 *
 *
 * @returns
 */
export function useB2bEmployeeManagement(): UseB2bEmployeeManagement {
  const { apiClient } = useShopwareContext();

  const getEmployees = () => {
    return apiClient.invoke("readEmployees post /employee");
  };

  const createSingleEmployee = (
    params: operations["createEmployee post /employee/create"]["body"],
  ) => {
    return apiClient.invoke("createEmployee post /employee/create", {
      body: {
        ...params,
      },
    });
  };

  const getEmployeeById = (employeeId: string) => {
    return apiClient.invoke("readEmployee post /employee/{id}", {
      pathParams: {
        id: employeeId,
      },
    });
  };

  /**
   * @toDo add storefornt url
   *
   * @param employeeId
   * @returns
   */
  const reinviteEmployee = (employeeId: string) => {
    return apiClient.invoke("reinviteEmployee post /employee/reinvite/{id}", {
      body: {},
      pathParams: {
        id: employeeId,
      },
    });
  };

  return {
    getEmployees,
    createSingleEmployee,
    getEmployeeById,
    reinviteEmployee,
  };
}
