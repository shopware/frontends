<script lang="ts" setup>
const { params } = useRoute();
const { getRoleById, updateRole } = useB2bEmployeeManagementRoles();

const state = reactive({
  id: "",
  name: "",
});

onMounted(async () => {
  const role = await getRoleById(params.id);
  state.id = role.id;
  state.name = role.name;
});

const handleUpdateRole = () => {
  updateRole(state.id, {
    name: state.name,
  });
};
</script>
<template>
  <h1>Edit role</h1>
  <form @submit.prevent="handleUpdateRole">
    <input type="text" placeholder="Role name" v-model="state.name" />
    <button>Update role</button>
  </form>
</template>
