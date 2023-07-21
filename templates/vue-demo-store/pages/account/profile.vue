<script setup lang="ts">
import {
  ChevronDownIcon,
} from '@heroicons/vue/20/solid';

definePageMeta({
  layout: "account",
});

useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
  {
    name: t("breadcrumbs.myAccount"),
    path: "/account/profile",
  },
]);
const { user } = useUser();

</script>

<script lang="ts">

export default {
  name: "ProfilePage",
};

const toggleTabs = (tabNumber: number) => {
 currentTab.value = tabNumber;
};

const currentTab = ref<number>(1);
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">
        {{ $t('my_profile') }}
      </h3>
      <p
        v-if="currentTab === 1"
        class="text-base"
      >
        {{ $t('check_your_personal_data') }}
      </p>
      <p
        v-if="currentTab === 2"
        class="text-base"
      >
        {{ $t('change_password') }}
      </p>
    </section>
    <section>
      <AccountPersonalData v-if="currentTab === 1" />
      <AccountChangePassword v-else />
    </section>
    <section v-if="currentTab === 1">
      <h4 class="text-lg font-medium mb-4">
        {{ $t('login_data') }}
      </h4>
      <p class="text-sm text-gray-900">
        {{ user?.email }}
      </p>
      <div class="flex items-center mt-6">
        <p class="mr-1 text-sm text-gray-700 font-medium">
          {{ $t('change_email_address') }}
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
      <div
        class="flex items-center mt-6 cursor-pointer"
        @click="() => toggleTabs(2)"
      >
        <p class="mr-1 text-sm text-gray-700 font-medium">
          {{ $t('change_password') }}
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
    </section>
    <section v-else>
      <div
        class="flex items-center mt-1 cursor-pointer"
        @click="() => toggleTabs(1)"
      >
        <p class="mr-1 text-sm text-gray-700 font-medium">
          {{ $t('check_your_personal_data') }}
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
    </section>
  </section>
</template>
