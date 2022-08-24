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

const toggleTabs = (tabNumber: number) => {
  currentTab.value = tabNumber;
};
</script>

<template>
  <div class="container mx-auto my-6">
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul
        class="flex flex-wrap -mb-px font-medium text-xl text-center"
        id="myTab"
        data-tabs-toggle="#profileTabContent"
        role="tablist"
      >
        <li class="mr-2" role="presentation">
          <a
            class="inline-block pb-3 pr-4 rounded-t-lg hover:text-brand-primary dark:text-brand-primary"
            :class="[
              currentTab !== 1
                ? 'text-gray-900'
                : 'text-brand-primary border-b-2 border-brand-primary',
            ]"
            @click="() => toggleTabs(1)"
            >Personal data</a
          >
        </li>
        <li role="presentation">
          <a
            class="inline-block pb-3 sm:pr-4 rounded-t-lg hover:text-brand-primary dark:text-brand-primary"
            :class="[
              currentTab !== 2
                ? 'text-gray-900'
                : 'text-brand-primary border-b-2 border-brand-primary',
            ]"
            @click="() => toggleTabs(2)"
            >Change password</a
          >
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
