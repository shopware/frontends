<script setup lang="ts">
import { useInternationalization, useShopwareContext } from "#imports";

const { params } = useRoute();
const { languages, getAvailableLanguages } = useInternationalization();

const { apiClient } = useShopwareContext();

const handleEditEmployee = async () => {
  const response = await apiClient.invoke(
    "updateEmployee patch /employee/{id}",
    {
      pathParams: {
        id: params.id,
      },
      body: {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        roleId: state.roleID,
      },
    },
  );
  await navigateTo("/employees");
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
  const {
    data: { elements },
  } = await apiClient.invoke("readRoles get /role");
  roles.value = elements;

  const { data: employeeData } = await apiClient.invoke(
    "readEmployee get /employee/{id}",
    {
      pathParams: {
        id: params.id,
      },
    },
  );

  state.firstName = employeeData.firstName;
  state.email = employeeData.email;
  state.roleID = employeeData.role;
  state.lastName = employeeData.lastName;
  languageId.value = employeeData.languageId;
});
</script>
<template>
  <div class="container mx-auto px-4">
    <h2>Create new employee account</h2>
    <NuxtLink
      to="/employees"
      class="text-blue-500 hover:underline mb-4 inline-block"
    >
      &larr; Back to employee list
    </NuxtLink>
    <form
      @submit.prevent="handleEditEmployee"
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
          Edit employee
        </button>
      </div>
    </form>
  </div>
</template>
