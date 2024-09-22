<script setup lang="ts">
const roles = ref([]);
const { getRoles, deleteRole } = useB2bEmployeeManagementRoles();

onMounted(async () => {
  const { elements } = await getRoles();
  roles.value = elements;
});

const handleCreateRole = () => {};

const handleDelete = (id: string) => {
  deleteRole(id);
};
</script>
<template>
  <h1>Roles</h1>
  <button @click="handleCreateRole">Create role</button>

  {{ roles }}
  <ul>
    <li v-for="role in roles" :key="role.id">
      <NuxtLink :to="`/edit-role/${role.id}`"> {{ role.name }}</NuxtLink>
      <button @click="handleDelete(role.id)">Delete</button>
    </li>
  </ul>
  {{ roles }}
</template>
