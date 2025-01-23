<script setup lang="ts">
const permissions = ref([]);
const state = reactive({
  roleName: "",
  isDefault: false,
});
const selectedPermissions = ref([]);
const { getPermissions, createSingleRole } = useB2bEmployeeManagementRoles();

onMounted(async () => {
  permissions.value = await getPermissions();
});

const handleCreateRole = async () => {
  await createSingleRole({
    name: state.roleName,
    isDefaultRole: state.isDefault,
    permissions: selectedPermissions.value,
  });
  navigateTo("/roles");
};
</script>
<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Create new role</h2>

    <form @submit.prevent="handleCreateRole" class="space-y-4 mb-6">
      <div>
        <input 
          type="text" 
          placeholder="Role name" 
          v-model="state.roleName"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <label class="flex items-center space-x-2 text-gray-700">
        <input 
          type="checkbox" 
          v-model="state.isDefault"
          class="form-checkbox h-5 w-5 text-blue-600"
        />
        <span>Default role</span>
      </label>
      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Create role
      </button>
    </form>
    <h3 class="text-xl font-semibold mb-3 text-gray-800">Permissions:</h3>
    <RolePermissions 
      :permissions="permissions" 
      v-model="selectedPermissions"
      class="bg-gray-100 p-4 rounded-md"
    />
  </div>
</template>