import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import { useB2bEmployeeManagementRoles } from "./useB2bEmployeeManagementRoles";

describe("useB2bEmployeeManagementRoles", () => {
  it("should trigger createSingleRole api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    const MOCKED_PARAMS = {
      name: "test",
    };
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    await vm.createSingleRole(MOCKED_PARAMS);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("createRole"),
      expect.objectContaining({ body: MOCKED_PARAMS }),
    );
  });

  it("should trigger getRoles api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ id: "test-1" }] },
    });
    await vm.getRoles();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readRoles"),
    );
  });

  it("should trigger getRoleById api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    injections.apiClient.invoke.mockResolvedValue({
      data: { id: "test-1" },
    });
    await vm.getRoleById("test-1");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readRole"),
      expect.objectContaining({ pathParams: { id: "test-1" } }),
    );
  });

  it("should trigger getPermissions api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    await vm.getPermissions();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readPermissions"),
    );
  });

  it("should trigger updateRole api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    const MOCKED_PARAMS = {
      name: "test",
    };
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    await vm.updateRole("test-1", MOCKED_PARAMS);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateRole"),
      expect.objectContaining({
        pathParams: { id: "test-1" },
        body: MOCKED_PARAMS,
      }),
    );
  });

  it("should trigger deleteRole api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    await vm.deleteRole("test-1");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("deleteRole"),
      expect.objectContaining({ pathParams: { id: "test-1" } }),
    );
  });

  it("should trigger updateDefaultRoleId api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    const MOCKED_PARAMS = {
      id: "test-1",
    };
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    await vm.updateDefaultRoleId(MOCKED_PARAMS);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateDefaultRoleId"),
      expect.objectContaining({ body: MOCKED_PARAMS }),
    );
  });

  it("should trigger setDefaultRole api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagementRoles);
    const MOCKED_PARAMS = {
      id: "test-1",
    };
    injections.apiClient.invoke.mockResolvedValue({
      data: {},
    });
    await vm.setDefaultRole(MOCKED_PARAMS);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateDefaultRoleId"),
      expect.objectContaining({ body: MOCKED_PARAMS }),
    );
  });
});
