<script setup lang="ts">
const { getRoles } = useB2bEmployeeManagementRoles();
const { createSingleEmployee } = useB2bEmployeeManagement();
const { languages, getAvailableLanguages } = useInternationalization();

const handleCreateEmployee = async () => {
  await createSingleEmployee(
    {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      roleID: state.roleID,
    },
    languageId.value,
  );

  navigateTo("/employees");
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
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Create new employee account</h2>
    <NuxtLink
      to="/employees"
      class="text-blue-500 hover:underline mb-4 inline-block"
    >
      &larr; Back to employee list
    </NuxtLink>
    <form
      @submit.prevent="handleCreateEmployee"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div class="flex flex-col">
        <label for="firstName" class="mb-2 font-semibold">First name</label>
        <input
          id="firstName"
          type="text"
          placeholder="First name"
          v-model="state.firstName"
          class="p-2 border rounded"
        />
      </div>
      <div class="flex flex-col">
        <label for="lastName" class="mb-2 font-semibold">Last name</label>
        <input
          id="lastName"
          type="text"
          placeholder="Last name"
          v-model="state.lastName"
          class="p-2 border rounded"
        />
      </div>
      <div class="flex flex-col">
        <label for="email" class="mb-2 font-semibold">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          v-model="state.email"
          class="p-2 border rounded"
        />
      </div>
      <div class="flex flex-col">
        <label for="role" class="mb-2 font-semibold">Role</label>
        <select id="role" v-model="state.roleID" class="p-2 border rounded">
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="language" class="mb-2 font-semibold">Language</label>
        <select id="language" v-model="languageId" class="p-2 border rounded">
          <option
            v-for="language in languages"
            :key="language.id"
            :value="language.id"
          >
            {{ language.name }}
          </option>
        </select>
      </div>
      <div class="flex items-end">
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">
          Create employee
        </button>
      </div>
    </form>
  </div>
</template>
