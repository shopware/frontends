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
    <NuxtLink to="/create-new-role">Create new role</NuxtLink>

    <ul v-if="roles.length">
      <li v-for="role in roles" :key="role.id">
        <NuxtLink :to="`/edit-role/${role.id}`"> {{ role.name }}</NuxtLink>
        <button @click="handleDelete(role.id)">Delete</button>
      </li>
    </ul>
    <div v-else>
      <p>
        No roles found, please
        <NuxtLink to="/create-new-role">add new role</NuxtLink>
      </p>
    </div>
  </div>
</template>
