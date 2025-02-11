<script setup lang="ts">
const { isLoggedIn } = useUser();
</script>
<template>
  <div class="container mx-auto px-4">
    <div
      class="relative flex flex-col my-6 bg-gray-100 shadow-sm border border-1 border-slate-200 border-solid rounded-lg w-full p-6"
    >
      <p class="block text-slate-600 leading-normal font-light mb-4">
        Employee management, as one of the B2B Components, is a feature that
        allows you to manage employees and their permissions as an extension to
        Shopware's account and customer management, but set into a company
        context. This means that employees are associated with a company
        customer and will act on behalf of that company, e.g., placing orders.
        Accordingly, employees can make use of addresses that have been defined
        by administrators of their company. You can find more information about
        the B2B Employee Management
        <a
          href="https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/"
          class="text-blue-600 hover:underline"
        >
          HERE</a
        >
      </p>
    </div>
    <div v-if="!isLoggedIn">
      <div
        class="mb-4 relative flex w-full p-3 text-sm text-white bg-red-600 rounded-md"
      >
        B2B Employee Management requires the user to be logged in.
      </div>
      <LoginForm class="mt-10" />
    </div>
    <div v-else class="flex justify-center gap-6">
      <div
        class="relative flex flex-col my-6 bg-white shadow-lg border border-slate-300 rounded-lg w-96 p-6 transition-transform transform hover:scale-105"
      >
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <g><rect fill="none" height="24" width="24" /></g>
            <g>
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"
              />
            </g>
          </svg>

          <h5 class="ml-3 text-slate-800 text-xl font-semibold">Employees</h5>
        </div>
        <p class="block text-slate-600 leading-normal font-light mb-4">
          The Employees section allows you to manage individual employees within
          your company. You can add, edit, and remove employees, as well as
          assign them specific roles and permissions. This feature is part of
          the B2B Employee Management system, which integrates seamlessly with
          Shopware's account and customer management. Employees can act on
          behalf of the company, placing orders and using company-defined
          addresses.
        </p>
        <div>
          <NuxtLink
            class="text-slate-800 font-semibold text-sm hover:underline flex items-center"
            to="/employees"
          >
            Try it
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
      <div
        class="relative flex flex-col my-6 bg-white shadow-lg border border-slate-300 rounded-lg w-96 p-6 transition-transform transform hover:scale-105"
      >
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6 text-slate-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <h5 class="ml-3 text-slate-800 text-xl font-semibold">Roles</h5>
        </div>
        <p class="block text-slate-600 leading-normal font-light mb-4">
          The Roles section allows you to define and manage various roles within
          your company. Each role can have specific permissions assigned to it,
          enabling you to control what actions employees can perform. This
          feature is part of the B2B Employee Management system, which
          integrates seamlessly with Shopware's account and customer management.
          By assigning roles, you can ensure that employees have the appropriate
          level of access based on their responsibilities.
        </p>
        <div>
          <NuxtLink
            class="text-slate-800 font-semibold text-sm hover:underline flex items-center"
            to="/roles"
          >
            Try it
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
