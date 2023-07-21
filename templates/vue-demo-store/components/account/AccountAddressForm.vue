<script setup lang="ts">
import { CustomerAddress, Country, Salutation } from "@shopware-pwa/types";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { SharedModal } from "~~/components/shared/SharedModal.vue";
import {
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const { createCustomerAddress, updateCustomerAddress } = useAddress();

const { close } = inject<SharedModal>("modal") as SharedModal;
const loading = ref();
const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const props = withDefaults(
  defineProps<{
    address?: CustomerAddress;
    countries: Array<Country>;
    salutations: Array<Salutation>;
    title?: string;
  }>(),
  {
    title: "new_address",
    address: undefined,
  }
);

const countriesOptions = computed(() => {
  return props.countries.map(country => ({
    label: country.translated.name,
    value: country.id
  }))
});

const formData = reactive<CustomerAddress>({
  id: props.address?.id ?? "",
  salutationId: props.address?.salutationId ?? props.salutations?.[0]?.id ?? "",
  firstName: props.address?.firstName ?? "",
  lastName: props.address?.lastName ?? "",
  street: props.address?.street ?? "",
  zipcode: props.address?.zipcode ?? "",
  city: props.address?.city ?? "",
  countryId: props.address?.countryId ?? "",
});

const rules = computed(() => ({
  salutationId: {
    required,
  },
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  street: {
    required,
    minLength: minLength(3),
  },
  zipcode: {
    required,
  },
  city: {
    required,
  },
  countryId: {
    required,
  },
}));

const $v = useVuelidate(rules, formData);

const invokeSave = async (): Promise<void> => {
  try {
    loading.value = true;
    const saveAddress = formData.id
      ? updateCustomerAddress
      : createCustomerAddress;
    await saveAddress(formData);
    emits("success");
    close();
  } catch (error) {
    console.error("error save address", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="px-4 py-5 sm:p-6 bg-white">
    <form id="account-address" name="account-address" method="post">
      <div class="flex flex-col gap-6">
        <div class="flex justify-between">
          <h3 class="text-lg font-medium">
            {{ $t(props.title) }}
          </h3>
          <button
            type="button"
            class="outline-none"
            @click="close"
          >
            <span class="sr-only">Close popup</span>
            <XMarkIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
        <div>
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-1">
              <SharedInput 
                :label="$t('first_name')" 
                :label-required="true" 
                v-model="formData.firstName"
                :errors="$v.firstName.$errors"
                @blur="$v.firstName.$touch()"
              />
            </div>
            <div class="flex-1">
              <SharedInput 
                :label="$t('last_name')" 
                :label-required="true" 
                v-model="formData.lastName"
                :errors="$v.lastName.$errors"
                @blur="$v.lastName.$touch()"
              />
            </div>
          </div>
        </div>
        <div>
          <SharedInput 
            :label="$t('street_address')" 
            :label-required="true" 
            v-model="formData.street"
            :errors="$v.street.$errors"
            @blur="$v.street.$touch()"
          />
        </div>
        <div class="flex gap-4 flex-col sm:flex-row">
          <div class="w-full sm:w-1/3">
            <SharedInput 
              :label="$t('zip_code')" 
              :label-required="true" 
              v-model="formData.zipcode"
              :errors="$v.zipcode.$errors"
              @blur="$v.zipcode.$touch()"
            />
          </div>
          <div class="w-full sm:w-2/3">
            <SharedInput 
              :label="$t('city')" 
              :label-required="true" 
              v-model="formData.city"
              :errors="$v.city.$errors"
              @blur="$v.city.$touch()"
            />
          </div>
        </div>
        <div>
          <SwSelect
            name="country"
            :label="$t('country')"
            :label-required="true"
            :compact="false"
            v-model="formData.countryId"
            autocomplete="country-name"
            :options="countriesOptions"
            :placeholder="$t('choose_country_placeholder')"
            :errors="$v.countryId.$errors"
            position="top-right"
          />
        </div>
        <div class="flex gap-3">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light"
            @click.stop.prevent="invokeSave"
            :disabled="loading"
          >
            {{ $t('add_address') }}
          </button>
          <button
            type="button"
            class="group relative w-20 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            @click="close"
          >
            {{ $t('cancel') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
