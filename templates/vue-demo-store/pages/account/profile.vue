<script lang="ts">
export default {
  name: "ProfilePage",
};
</script>

<script setup lang="ts">
definePageMeta({
  layout: "account",
});

const currentTab = ref<number>(1);
const { t } = useI18n();

useBreadcrumbs([
  {
    name: t("breadcrumbs.accountOverview"),
    path: "/account",
  },
  {
    name: t("breadcrumbs.myAccount"),
    path: "/account/profile",
  },
]);
const toggleTabs = (tabNumber: number) => {
  currentTab.value = tabNumber;
};
</script>

<template>
  <div class="container mx-auto my-8">
    <div class="mb-4 border-b border-secondary-200">
      <ul
        id="myTab"
        class="flex flex-wrap -mb-px font-medium md:text-2xl md:space-x-8 list-none pl-0"
        data-tabs-toggle="#profileTabContent"
        role="tablist"
      >
        <li class="w-1/2 md:w-auto" role="tab">
          <a
            class="inline-block pb-3 rounded-t-lg hover:text-primary"
            :class="[
              currentTab !== 1
                ? 'text-secondary-900'
                : 'text-primary border-b-2 border-primary',
            ]"
            @click="() => toggleTabs(1)"
          >
            {{ $t("account.personalData.label") }}
          </a>
        </li>
        <li class="w-1/2 md:w-auto" role="tab">
          <a
            class="inline-block pb-3 rounded-t-lg hover:text-primary"
            :class="[
              currentTab !== 2
                ? 'text-secondary-900'
                : 'text-primary border-b-2 border-primary',
            ]"
            @click="() => toggleTabs(2)"
          >
            {{ $t("account.changePassword") }}
          </a>
        </li>
      </ul>
    </div>
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6">
      <div class="py-5 flex-auto">
        <div
          :class="[
            'cms-block-product-description-reviews__description',
            currentTab !== 1 ? 'hidden' : 'block',
          ]"
        >
          <AccountPersonalData />
        </div>
        <div
          :class="[
            'cms-block-product-description-reviews__reviews',
            currentTab !== 2 ? 'hidden' : 'block',
          ]"
        >
          <AccountChangePassword />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
