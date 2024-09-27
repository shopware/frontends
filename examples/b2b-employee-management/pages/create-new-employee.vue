<script setup lang="ts">
const { getRoles } = useB2bEmployeeManagementRoles();
const { createSingleEmployee } = useB2bEmployeeManagement();
const { languages, getAvailableLanguages } = useInternationalization();

const handleCreateEmployee = () => {
  createSingleEmployee(
    {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      roleID: state.roleID,
    },
    languageId.value,
  );
};
const state = reactive({
  firstName: "",
  lastName: "",
  email: "",
  roleID: "",
});

const languageId = ref(null);

const roles = ref([]);

onMounted(async () => {
  await getAvailableLanguages();
  const { elements } = await getRoles();
  roles.value = elements;
});
</script>
<template>
  <div class="container mx-auto px-4">
    <h2>Create new employee account</h2>
    <form @submit.prevent="handleCreateEmployee">
      <input type="text" placeholder="First name" v-model="state.firstName" />
      <input type="text" placeholder="Last name" v-model="state.lastName" />
      <input type="email" placeholder="Email" v-model="state.email" />

      <select v-model="state.roleID" placeholder="Role">
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
      <select v-model="languageId" placeholder="Language">
        <option
          v-for="language in languages"
          :key="language.id"
          :value="language.id"
        >
          {{ language.name }}
        </option>
      </select>

      <button type="submit">Create employee</button>
    </form>
  </div>
</template>
