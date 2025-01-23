<script setup lang="ts">
const { params } = useRoute();
const { apiClient } = useShopwareContext();

const permissions = ref([]);
const selectedPermissions = ref([]);

const state = reactive({
  id: "",
  roleName: "",
  isDefault: false,
});

onMounted(async () => {
  const { data: roleData } = await apiClient.invoke("readRole get /role/{id}", {
    pathParams: {
      id: params.id,
    },
  });
  const { data: permissionsData } = await apiClient.invoke(
    "readPermissions get /permission",
  );
  permissions.value = permissionsData;

  state.id = roleData.id;
  state.roleName = roleData.name;
  selectedPermissions.value = roleData.permissions ?? [];
});

const handleUpdateRole = () => {
  apiClient.invoke("updateRole patch /role/{id}", {
    pathParams: {
      id: state.id,
    },
    body: {
      name: state.name,
    },
  });
};
</script>
<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <NuxtLink to="/roles" class="text-blue-500 hover:underline"
      >← Back to roles</NuxtLink
    >
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Edit role</h2>

    <form @submit.prevent="handleUpdateRole" class="space-y-4 mb-6">
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
        Update role
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
