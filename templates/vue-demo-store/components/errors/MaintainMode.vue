<template>
  <div
    class="px-5 py-20 md:px-32 lg:px-24 items-center flex flex-col gap-10 justify-center"
  >
    <div class="flex items-center justify-center">
      <img
        class="w-full h-full"
        src="~/assets/maintenance_mode.svg"
        alt="Maintenance"
      />
    </div>
    <div class="flex flex-col items-center justify-center my-8">
      <div class="text-center">
        <h1 class="mb-4 font-extrabold text-3xl md:text-5xl">
          {{ $t("maintenance.title") }}
        </h1>
        <p class="text-sm md:text-2xl mt-4 mb-8">
          {{ $t("maintenance.text") }}
        </p>
      </div>
    </div>
  </div>
</template>
