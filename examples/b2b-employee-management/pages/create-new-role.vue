<script setup lang="ts">
const permissions = ref([]);
const state = reactive({
  roleName: "",
  isDefault: false,
});

const { getPermissions, createSingleRole } = useB2bEmployeeManagementRoles();

onMounted(async () => {
  permissions.value = await getPermissions();
});

const handleCreateRole = () => {
  createSingleRole({
    name: state.roleName,
    isDefaultRole: state.isDefault,
  });
};
</script>
<template>
  Create new role
  <form @submit.prevent="handleCreateRole">
    <input type="text" placeholder="Role name" v-model="state.roleName" />
    <input type="checkbox" v-model="state.isDefault" />
    <button>Create role</button>
  </form>
  Permissions:
  {{ permissions }}
</template>
