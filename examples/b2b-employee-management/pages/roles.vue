<script setup lang="ts">
const roles = ref([]);
const { getRoles, deleteRole } = useB2bEmployeeManagementRoles();

onMounted(async () => {
  updateRoles();
});

const handleDelete = async (id: string) => {
  await deleteRole(id);
  updateRoles();
};

const updateRoles = async () => {
  const { elements } = await getRoles();
  roles.value = elements;
};
</script>
<template>
  <div class="container mx-auto px-4">
    <h2>Roles</h2>
    <NuxtLink
      to="/create-new-role"
      class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
    >
      Create new role
    </NuxtLink>
    <table v-if="roles.length" class="min-w-full bg-white">
      <thead>
        <tr>
          <th
            class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
          >
            Role
          </th>

          <th class="py-2 px-4 border-b border-gray-200 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-100">
          <td class="py-2 px-4 border-b border-gray-200">
            {{ role.name }}
          </td>

          <td class="py-2 px-4 border-b border-gray-200">
            <div class="flex justify-end">
              <NuxtLink
                :to="`/edit-role/${role.id}`"
                class="text-blue-500 hover:text-blue-700"
                >Edit</NuxtLink
              >
              <Button
                @click="handleDelete(role.id)"
                class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >Delete</Button
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>
        No roles found, please
        <NuxtLink to="/create-new-role">add new role</NuxtLink>
      </p>
    </div>
  </div>
</template>
