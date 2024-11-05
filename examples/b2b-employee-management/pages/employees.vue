<script setup lang="ts">
const employees = ref([]);
const { getEmployees, reinviteEmployee, deleteEmployee } =
  useB2bEmployeeManagement();

onMounted(async () => {
  updateEmployees();
});

const updateEmployees = async () => {
  const { elements } = await getEmployees();
  employees.value = elements;
};

const handleResendInvitation = async (employeeId: string) => {
  await reinviteEmployee(employeeId);
};

const handleDeleteEmployee = async (employeeId: string) => {
  await deleteEmployee(employeeId);
  updateEmployees();
};
</script>
<template>
  <div class="container mx-auto px-4">
    <h2>Employees</h2>
    <NuxtLink
      to="/create-new-employee"
      class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
    >
      Create new employee
    </NuxtLink>
    <table v-if="employees.length" class="min-w-full bg-white">
      <thead>
        <tr>
          <th
            class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
          >
            First Name
          </th>
          <th
            class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
          >
            Last Name
          </th>
          <th
            class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
          >
            Role
          </th>
          <th
            class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
          >
            Email
          </th>
          <th class="py-2 px-4 border-b border-gray-200 bg-gray-100"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="employee in employees"
          :key="employee.id"
          class="hover:bg-gray-100"
        >
          <td class="py-2 px-4 border-b border-gray-200">
            {{ employee.firstName }}
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            {{ employee.lastName }}
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            {{ employee.role?.name }}
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            {{ employee.status }}
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            {{ employee.email }}
          </td>
          <td class="py-2 px-4 border-b border-gray-200">
            <NuxtLink
              :to="`/edit-employee/${employee.id}`"
              class="text-blue-500 hover:text-blue-700"
              >Edit</NuxtLink
            >
            <Button
              @click="handleResendInvitation(employee.id)"
              class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >Resend Invitation</Button
            >
            <Button
              @click="handleDeleteEmployee(employee.id)"
              class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >Delete</Button
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>
        No employees found, please
        <NuxtLink to="/create-new-employee">add new employee</NuxtLink>
      </p>
    </div>
  </div>
</template>
