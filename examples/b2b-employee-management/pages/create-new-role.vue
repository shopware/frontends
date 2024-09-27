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

const handleCreateRole = async () => {
  await createSingleRole({
    name: state.roleName,
    isDefaultRole: state.isDefault,
  });
  state.roleName = "";
  state.isDefault = false;
};
</script>
<template>
  <div class="container mx-auto px-4">
    <h2>Create new role</h2>
    <form @submit.prevent="handleCreateRole">
      <input type="text" placeholder="Role name" v-model="state.roleName" />
      <label>
        <input type="checkbox" v-model="state.isDefault" />
        Default role
      </label>
      <button>Create role</button>
    </form>
    Permissions:
    {{ permissions }}
  </div>
</template>
