<template>
  <div
    class="max-w-md flex flex-col items-center gap-4 text-center"
    data-testid="maintenance-page"
  >
    <SharedIconBadge icon="i-carbon-tools" size="large" />
    <h1
      class="mt-2 text-4xl md:text-5xl font-['Noto_Serif'] leading-tight text-surface-on-surface"
    >
      {{ $t("errorPage.maintenance.title") }}
    </h1>
    <p class="text-lg text-surface-on-surface-variant">
      {{ $t("errorPage.maintenance.text") }}
    </p>
  </div>
</template>
