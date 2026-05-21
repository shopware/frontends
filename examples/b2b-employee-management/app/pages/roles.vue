<script setup lang="ts">
import {
  extractApiErrors,
  getMissingPermissions,
  type ExampleApiError,
} from "~/utils/apiErrors";

type Role = {
  id: string;
  name: string;
};

const { apiClient } = useShopwareContext();
const toast = useToast();
const roles = ref<Role[]>([]);
const isLoading = ref(false);
const responseErrors = ref<ExampleApiError[]>([]);

const missingPermissions = computed(() =>
  getMissingPermissions(responseErrors.value),
);

const errorTitle = computed(() => {
  if (!responseErrors.value.length) {
    return "";
  }

  return responseErrors.value[0]?.title || "Request failed";
});

const errorDetail = computed(() => {
  if (!responseErrors.value.length) {
    return "";
  }

  return (
    responseErrors.value[0]?.detail ||
    "The Store API returned an error while loading roles."
  );
});

onMounted(async () => {
  await updateRoles();
});

const handleDelete = async (id: string) => {
  try {
    await apiClient.invoke("deleteRole delete /role/{id}", {
      pathParams: {
        id,
      },
    });
    await updateRoles();
  } catch (error) {
    console.error(error);
    const [apiError] = extractApiErrors(error);
    toast.error({
      title: apiError?.title || "Delete failed",
      message:
        apiError?.detail ||
        "The role could not be deleted. Check role permissions and try again.",
    });
  }
};

const updateRoles = async () => {
  isLoading.value = true;
  responseErrors.value = [];

  try {
    const {
      data: { elements },
    } = await apiClient.invoke("readRoles get /role");
    roles.value = elements || [];
  } catch (error) {
    console.error(error);
    roles.value = [];
    responseErrors.value = extractApiErrors(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto px-4 pb-12">
    <div class="my-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          B2B administration
        </p>
        <h2 class="mt-1 text-3xl font-semibold text-slate-900">Roles</h2>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          This page calls the B2B role endpoint and requires the current B2B
          employee to have permission to read roles.
        </p>
      </div>
      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Back to overview
      </NuxtLink>
    </div>

    <div v-if="responseErrors.length" class="rounded-lg border border-red-200 bg-red-50 p-6">
      <p class="text-sm font-semibold uppercase tracking-wide text-red-700">
        {{ responseErrors[0]?.status ? `Error ${responseErrors[0].status}` : "API error" }}
      </p>
      <h3 class="mt-2 text-2xl font-semibold text-red-950">
        {{ errorTitle }}
      </h3>
      <p class="mt-2 text-sm leading-6 text-red-900">
        {{ errorDetail }}
      </p>
      <div
        v-if="missingPermissions.length"
        class="mt-4 rounded-md border border-red-200 bg-white p-4 text-sm leading-6 text-red-950"
      >
        <p class="font-semibold">Missing B2B permissions</p>
        <p class="mt-1">
          The user is logged in as a B2B employee, but the assigned role does not
          allow this action. Add the following permission in B2B Employee
          Management and log in again:
        </p>
        <ul class="mt-2 list-disc pl-5">
          <li v-for="permission in missingPermissions" :key="permission">
            <code class="rounded bg-red-100 px-1.5 py-0.5 text-xs">{{ permission }}</code>
          </li>
        </ul>
      </div>
      <div class="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          @click="updateRoles"
        >
          Try again
        </button>
        <NuxtLink
          to="/"
          class="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-white"
        >
          Back to overview
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <NuxtLink
          to="/create-new-role"
          class="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create new role
        </NuxtLink>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoading"
          @click="updateRoles"
        >
          {{ isLoading ? "Loading..." : "Refresh" }}
        </button>
      </div>

      <div
        v-if="isLoading"
        class="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600"
      >
        Loading roles...
      </div>

      <table v-else-if="roles.length" class="min-w-full bg-white">
        <thead>
          <tr>
            <th
              class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider"
            >
              Role
            </th>

            <th class="py-2 px-4 border-b border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b border-gray-200">
              {{ role.name }}
            </td>

            <td class="py-2 px-4 border-b border-gray-200">
              <div class="flex justify-end">
                <NuxtLink
                  :to="`/edit-role/${role.id}`"
                  class="text-blue-500 hover:text-blue-700"
                  >Edit</NuxtLink
                >
                <button
                  @click="handleDelete(role.id)"
                  class="ml-2 rounded bg-red-500 py-1 px-2 font-bold text-white hover:bg-red-700"
                  >Delete</button
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="rounded-lg border border-slate-200 bg-white p-6">
        <p class="text-sm leading-6 text-slate-600">
          No roles found. You can add the first role or go back to the overview
          to inspect the current session.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <NuxtLink
            to="/create-new-role"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add new role
          </NuxtLink>
          <NuxtLink
            to="/"
            class="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to overview
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
