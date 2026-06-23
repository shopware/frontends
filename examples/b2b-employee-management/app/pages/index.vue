<script setup lang="ts">
const {
  currentOrganization,
  currentUserEmail,
  currentUserName,
  currentUserRole,
  currentUserStatus,
  handleLogout,
  isB2bEmployeeSession,
  isLoggedIn,
  isLoggingOut,
} = useB2bEmployeeSession();
</script>

<template>
  <div class="container mx-auto px-4 pb-12">
    <div
      class="relative my-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-8 shadow-sm"
    >
      <p
        class="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800"
      >
        Commercial example
      </p>
      <h2 class="mb-4 text-3xl font-semibold text-white">
        B2B Employee Management
      </h2>
      <p class="max-w-4xl text-base leading-7 text-slate-200">
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
          class="font-semibold text-blue-200 hover:text-white hover:underline"
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

    <div v-else>
      <div class="grid gap-6 lg:grid-cols-2">
        <div
          class="relative flex min-h-80 flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="mb-5 flex items-center">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="currentColor"
              >
                <g><rect fill="none" height="24" width="24" /></g>
                <g>
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"
                  />
                </g>
              </svg>
            </div>

            <h5 class="ml-3 text-xl font-semibold text-slate-900">Employees</h5>
          </div>
          <p class="mb-6 text-sm leading-6 text-slate-600">
            The Employees section allows you to manage individual employees
            within your company. You can add, edit, and remove employees, as
            well as assign them specific roles and permissions. This feature is
            part of the B2B Employee Management system, which integrates
            seamlessly with Shopware's account and customer management.
            Employees can act on behalf of the company, placing orders and using
            company-defined addresses.
          </p>
          <div class="mt-auto">
            <NuxtLink
              class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
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
          class="relative flex min-h-80 flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="mb-5 flex items-center">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </div>
            <h5 class="ml-3 text-xl font-semibold text-slate-900">Roles</h5>
          </div>
          <p class="mb-6 text-sm leading-6 text-slate-600">
            The Roles section allows you to define and manage various roles
            within your company. Each role can have specific permissions
            assigned to it, enabling you to control what actions employees can
            perform. By assigning roles, you can ensure that employees have the
            appropriate level of access based on their responsibilities.
          </p>
          <div class="mt-auto">
            <NuxtLink
              class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
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

      <section
        class="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div
          class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <p
              class="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Current session
            </p>
            <h3 class="mt-1 text-2xl font-semibold text-slate-900">
              {{ currentUserName }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              This panel reads the Store API context and checks
              <code
                class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800"
                >extensions.b2bEmployee</code
              >. If the extension is present, the session belongs to a B2B
              employee. Without it, the customer is logged in as a regular
              Shopware user.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            {{ isLoggingOut ? "Signing out..." : "Logout" }}
          </button>
        </div>

        <div class="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Login type
            </p>
            <p
              class="mt-2 text-sm font-semibold"
              :class="isB2bEmployeeSession ? 'text-blue-700' : 'text-slate-800'"
            >
              {{ isB2bEmployeeSession ? "B2B employee" : "Regular customer" }}
            </p>
          </div>
          <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Email
            </p>
            <p class="mt-2 break-words text-sm font-semibold text-slate-800">
              {{ currentUserEmail || "No email in context" }}
            </p>
          </div>
          <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Role
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-800">
              {{ currentUserRole }}
            </p>
          </div>
          <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Status
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-800">
              {{ currentUserStatus }}
            </p>
          </div>
        </div>

        <div
          v-if="isB2bEmployeeSession"
          class="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"
        >
          <span class="font-semibold">Organization context:</span>
          {{ currentOrganization }}
        </div>
      </section>
    </div>

    <section
      class="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p
            class="text-sm font-semibold uppercase tracking-wide text-slate-500"
          >
            Developer experience
          </p>
          <h3 class="mt-1 text-2xl font-semibold text-slate-900">
            How B2B employee login works
          </h3>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            From the storefront perspective, B2B employee login intentionally
            uses the same customer session mechanics as a standard Shopware
            login. The difference is visible after the context is refreshed: the
            Store API enriches the session with the B2B employee extension, so
            the frontend can switch from generic account UI to company-scoped
            employee UI.
          </p>
        </div>
        <div class="space-y-4">
          <div class="rounded-md border border-slate-200 p-4">
            <p class="font-semibold text-slate-900">1. Authenticate</p>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Call
              <code
                class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800"
                >loginCustomer post /account/login</code
              >
              through <code>useUser().login</code>. The request creates the
              customer session and updates the context token handled by the
              Shopware API client.
            </p>
          </div>
          <div class="rounded-md border border-slate-200 p-4">
            <p class="font-semibold text-slate-900">2. Refresh context</p>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              After login, <code>useUser().login</code> calls
              <code>refreshSessionContext()</code>, which reads
              <code>readContext get /context</code>. This response is the source
              of truth for the current storefront identity.
            </p>
          </div>
          <div class="rounded-md border border-slate-200 p-4">
            <p class="font-semibold text-slate-900">3. Detect B2B employee</p>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Check
              <code
                class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800"
                >sessionContext.extensions.b2bEmployee</code
              >. When it exists, the logged-in customer is acting as a B2B
              employee and can use employee-specific endpoints such as
              <code>readEmployeesPOST post /employee</code> and
              <code>readRoles get /role</code>, according to the permissions
              attached to their B2B role.
            </p>
          </div>
          <div class="rounded-md border border-slate-200 p-4">
            <p class="font-semibold text-slate-900">4. Logout</p>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Use <code>useUser().logout</code> to end the customer session,
              refresh the context, and return the example to the unauthenticated
              state. The B2B extension disappears together with the logged-in
              context.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
