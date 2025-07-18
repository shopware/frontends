<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Permission Selector</h2>
    <div v-for="group in groupedPermissions" :key="group.name" class="mb-6">
      <div class="flex items-center mb-2">
        <input
          type="checkbox"
          :id="group.name"
          :checked="isGroupChecked(group)"
          @change="toggleGroup(group)"
          class="form-checkbox h-5 w-5 text-blue-600"
        />
        <label :for="group.name" class="ml-2 text-lg font-semibold">
          {{ formatGroupName(group.name) }}
        </label>
      </div>
      <div class="ml-6 space-y-2">
        <div
          v-for="permission in group.permissions"
          :key="permission.permissionName"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :id="permission.permissionName"
            v-model="model"
            :value="permission.permissionName"
            class="form-checkbox h-4 w-4 text-blue-600"
          />
          <label :for="permission.permissionName" class="ml-2">
            {{ formatPermissionName(permission.permissionName) }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  permissions: {
    type: Array,
    required: true,
  },
});

const model = defineModel();

const groupedPermissions = computed(() => {
  const groups = {};
  props.permissions.forEach((permission) => {
    if (!groups[permission.permissionGroupName]) {
      groups[permission.permissionGroupName] = {
        name: permission.permissionGroupName,
        permissions: [],
      };
    }
    groups[permission.permissionGroupName].permissions.push(permission);
  });
  return Object.values(groups);
});

const isGroupChecked = (group) => {
  return group.permissions.every((permission) =>
    model.value.includes(permission.permissionName),
  );
};

const toggleGroup = (group) => {
  const allSelected = isGroupChecked(group);
  group.permissions.forEach((permission) => {
    const index = model.value.indexOf(permission.permissionName);
    if (allSelected && index !== -1) {
      model.value.splice(index, 1);
    } else if (!allSelected && index === -1) {
      model.value.push(permission.permissionName);
    }
  });
  updateAllDependencies();
};

const updateAllDependencies = () => {
  let changed;
  do {
    changed = false;
    props.permissions.forEach((permission) => {
      if (model.value.includes(permission.permissionName)) {
        permission.permissionDependencies.forEach((dep) => {
          if (!model.value.includes(dep)) {
            model.value.push(dep);
            changed = true;
          }
        });
      }
    });
  } while (changed);
};

const formatGroupName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const formatPermissionName = (name) => {
  return name
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
</script>
