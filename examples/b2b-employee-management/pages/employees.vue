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
    <NuxtLink to="/create-new-employee">Create new employee</NuxtLink>
    <table v-if="employees.length">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.id">
          <td>{{ employee.firstName }}</td>
          <td>{{ employee.lastName }}</td>
          <td>{{ employee.role?.name }}</td>
          <td>{{ employee.status }}</td>
          <td>{{ employee.email }}</td>
          <td>
            <NuxtLink :to="`/edit-employee/${employee.id}`">Edit</NuxtLink>
            <Button @click="handleResendInvitation(employee.id)"
              >Resend Invitation</Button
            >
            <Button @click="handleDeleteEmployee(employee.id)">Delete</Button>
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
