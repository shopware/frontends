<script setup lang="ts">
import { SharedModal } from "../shared/SharedModal.vue";
import {
  XMarkIcon,
} from '@heroicons/vue/24/solid';

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();
const modal = inject<SharedModal>("modal") as SharedModal;

const { resetPassword, errors } = useCustomerPassword();
const { apiInstance } = useShopwareContext();
const isSuccess = ref(false);
const loading = ref();

const formData = ref({
  email: "",
  storefrontUrl: apiInstance.config.endpoint,
});

const recoverPasswordErrors = computed(() =>
  errors.resetPassword?.map(({ detail }) => detail).toString()
);

const invokeRecover = async (): Promise<void> => {
  loading.value = true;
  try {
    const emailSent = await resetPassword(formData.value);

    if (emailSent) {
      isSuccess.value = true;
      emits("success");
    }
  } catch (error) {
    console.error("error resend email", error);
  } finally {
    loading.value = false;
  }
};

const openLogin = () => {
  emits("close");
  setTimeout(() => {
    modal.open('AccountLoginForm', {
      position: 'side'
    })
  }, 300);
}
</script>

<template>
   <div class="w-full pointer-events-auto h-full">
    <div class="flex h-full w-full flex-col bg-white shadow-xl p-6">
      <div class="flex flex-col h-full">
        <div class="flex items-start justify-between mb-6">
          <h2
            id="slide-over-title"
            class="text-lg capitalize font-medium text-gray-900 py-0"
          >
            {{ $t('password_recovery') }}
          </h2>
          <div class="ml-3 flex h-7 items-center">
            <button
              type="button"
              class="-m-2 p-2 text-gray-700"
              @click="emits('close')"
            >
              <span class="sr-only">Close panel</span>
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-0">
          <form class="flex-1 min-h-0 flex flex-col gap-6" @submit.prevent="invokeRecover">
            <p>{{ $t('send_confirm_email') }}</p>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1" for="email">{{ $t('email_address') }}</label>
              <input
                v-model="formData.email"
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              class="flex capitalize items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-50"
              :disabled="loading"
            >
              {{ $t('request_email') }}
            </button>
          </form>
          <div class="text-center flex flex-col mt-10 gap-4">
            <button
              type="button"
              class="flex capitalize items-center justify-center px-5 py-2 text-base font-medium text-gray-700 shadow-sm border border-gray-300 bg-white"
              @click="openLogin"
            >
              {{ $t('back_to_log_in') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
