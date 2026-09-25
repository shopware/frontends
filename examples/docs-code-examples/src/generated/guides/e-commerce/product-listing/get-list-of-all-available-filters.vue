<script setup lang="ts">
import { useListing } from "#imports";
const { getAvailableFilters, getCurrentFilters, setCurrentFilters } =
  useListing(/** parameters omitted */);

const selectManufacturerAndSearch = (manufacturerId: string) => {
  setCurrentFilters([{ code: "manufacturer", value: [manufacturerId] }]);
};

// element from getAvailableFilters.value
// i.e: getAvailableFilters.value?.find(({ code }) => code === "manufacturer")?.[0]
const manufacturerFilter = {
  apiAlias: "manufacturer_aggregation",
  code: "manufacturer",
  label: "manufacturer",
  entities: [
    {
      extensions: {
        foreignKeys: {
          apiAlias: "array_struct",
        },
      },
      _uniqueIdentifier: "1d39db66fd184de8bdcfbf995197f8ea",
      versionId: "0fa91ce3e96a4bc2be4bd9ce752c3425",
      translated: {
        name: "Boomers Gourmet",
        description: "Description",
        customFields: {},
      },
      createdAt: "2020-08-06T06:26:30.608+00:00",
      updatedAt: null,
      mediaId: "ef102a5043174d8b936623b175c8af57",
      name: "Boomers Gourmet",
      link: "http://www.gewuerze-boomers.de/",
      description: "Description",
      media: null,
      translations: null,
      id: "1d39db66fd184de8bdcfbf995197f8ea",
      customFields: null,
      apiAlias: "product_manufacturer",
    },
    // other manufacturer objects
  ],
};
</script>

<template>
  <h3>{{ manufacturerFilter.label }}</h3>
  <div
    v-for="manufacturer in manufacturerFilter.entities"
    :key="manufacturer.id"
  >
    <input
      :id="`filter-mobile-${manufacturerFilter.code}-${manufacturer.id}`"
      type="checkbox"
      :name="manufacturerFilter.code"
      :checked="getCurrentFilters.manufacturer?.includes(manufacturer.id)"
      @click="selectManufacturerAndSearch(manufacturer.id)"
    />
    <label :for="`filter-mobile-${manufacturerFilter.code}-${manufacturer.id}`">
      {{ manufacturer.name }}
    </label>
  </div>
</template>
