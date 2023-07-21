<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ClientApiError } from "@shopware-pwa/types";
import { customValidators } from "@/i18n/utils/i18n-validators";
const { required, minLength, requiredIf, email, sameAs } = customValidators();

const { user, refreshUser, updatePersonalInfo } = useUser();
const { pushSuccess, pushError } = useNotifications();

const errorMessages = ref<string[]>([]);

const isSuccess = ref(false);
const updated = ref(false);
const isUpdating = ref(false);
const isLoading = ref(true);


const state = reactive({
  salutationId: "",
  title: "",
  fullName: "",
});

// const isEmailChanging = computed(() => state.email !== user.value?.email);

const isNameChanging = computed(
  () => state.fullName !== user.value?.firstName + " " + user.value?.lastName
);

const refs = toRefs(state);

// const emailConfirmationValidationRule = computed(() =>
//   isEmailChanging.value
//     ? {
//         required,
//         email,
//         sameAsEmail: sameAs(refs.email),
//       }
//     : {}
// );

const rules = computed(() => ({
  fullName: {
    required,
  },
  // email: {
  //   email,
  //   required,
  // },
  // emailConfirmation: emailConfirmationValidationRule.value, // take a dynamic one
  // password: {
  //   required: requiredIf(() => {
  //     return isEmailChanging.value;
  //   }),
  //   minLength: minLength(8),
  // },
}));

const $v = useVuelidate(rules, state);

const invokeUpdate = async (): Promise<void> => {
  errorMessages.value = [];
  isSuccess.value = false;
  try {
    loadingData.value = true;
    updated.value = false;
    $v.value.$touch();
    if ($v.value.$invalid) {
      return;
    }
    isUpdating.value = true;

    if (isNameChanging.value) {
      const [fistName, ...lastName] = state.fullName.split(" ");
      try {
        if (lastName?.length) {
          await updatePersonalInfo({
            firstName: fistName,
            lastName: lastName.join(" "),
            salutationId: state.salutationId,
            title: state.title,
          });
        }
        pushSuccess('Updated successfully!')
      } catch (e) {
        pushError('Something went wrong!')
      } finally {
        isSuccess.value = true;
      }

    }
    // if (isEmailChanging.value) {
    //   await updateEmail({
    //     email: state.email,
    //     emailConfirmation: state.emailConfirmation,
    //     password: state.password,
    //   });
    //   isSuccess.value = true;
    // }

    isUpdating.value = false;
    refreshUser();
  } catch (err) {
    const e = err as ClientApiError;
    errorMessages.value = e.messages.map((m) => m.detail);
  } finally {
    loadingData.value = false;
  }
};

onMounted(async () => {
  await refreshUser();
  isLoading.value = false;
  state.salutationId = user.value?.salutationId || "";
  state.title = user.value?.title || "";
  state.fullName = user.value?.firstName + " " + user.value?.lastName;
});
</script>
<template>
  <h6>{{ $t("personal_data") }}</h6>
  <div class="mt-4">
    <div v-if="isLoading" class="w-full h-full">
      <div class="flex animate-pulse flex-col items-top h-full space-y-5">
        <div class="w-35 bg-gray-300 h-8 rounded-md" />
        <div class="w-20 bg-gray-300 h-6 rounded-md" />
        <div class="w-full bg-gray-300 h-10 rounded-md" />
      </div>
    </div>

    <form v-else class="flex flex-col gap-6" @submit.prevent="invokeUpdate">
      <div>
        <label for="fullName" class="text-sm text-gray-700 font-medium mb-1">
          {{ $t("full_name") }}
        </label>
        <input
          v-model="state.fullName"
          id="fullName"
          class="border border-gray-300 py-2 px-3 text-base md:text-sm text-gray-900 w-full shadow-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          :disabled="isUpdating"
          class="text-white font-medium py-2 px-5 bg-gray-800 shadow-sm disabled:opacity-50"
        >
          {{ $t("update_personal_data") }}
        </button>
      </div>
    </form>
  </div>
</template>
