<script lang="ts">
export default {
  name: "CheckoutPage",
};
</script>
<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { useVuelidate } from "@vuelidate/core";
import { ClientApiError, ShopwareError } from "@shopware-pwa/types";
import {
  CheckCircleIcon,
} from '@heroicons/vue/20/solid';
import {
  PencilSquareIcon
} from '@heroicons/vue/24/outline';

definePageMeta({
  layout: "checkout",
});

const isSameBillingAndShipping = ref(true);
const submitBtn = ref();
const isAgree = ref();
const isAgreeError = ref();
const { push } = useRouter();
const { currency } = useSessionContext();
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const { pushInfo } = useNotifications();
const { t } = useI18n();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const {
  paymentMethods,
  shippingMethods,
  getPaymentMethods,
  getShippingMethods,
  createOrder,
} = useCheckout();
const { register, logout, isLoggedIn, isGuestSession, user } = useUser();
const {
  refreshSessionContext,
  selectedShippingMethod: shippingMethod,
  selectedPaymentMethod: paymentMethod,
  setShippingMethod,
  setPaymentMethod,
  activeShippingAddress,
  setActiveShippingAddress,
  activeBillingAddress,
  setActiveBillingAddress,
} = useSessionContext();
const { cart, cartItems, subtotal, totalPrice, shippingTotal, refreshCart } = useCart();
const { customerAddresses, loadCustomerAddresses } = useAddress();

const modal = inject<SharedModal>("modal") as SharedModal;
const isLoading = reactive<{ [key: string]: boolean }>({});

watch([isLoggedIn, isGuestSession], ([isLogged, isLoggedGuest]) => {
  if (isLogged || isLoggedGuest) {
    loadCustomerAddresses();
  }
});

const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    isLoading[shippingMethodId] = true;
    await setShippingMethod({ id: shippingMethodId });
    await refreshCart();
    isLoading[shippingMethodId] = false;
  },
});
const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading[paymentMethodId] = true;
    await setPaymentMethod({ id: paymentMethodId });
    isLoading[paymentMethodId] = false;
  },
});

const selectedShippingAddress = computed({
  get(): string {
    return activeShippingAddress.value?.id || "";
  },
  async set(shippingAddressId: string) {
    isLoading[`shipping-${shippingAddressId}`] = true;
    await setActiveShippingAddress({ id: shippingAddressId });
    if (shippingAddressId === selectedBillingAddress.value)
      state.customShipping = false;
    isLoading[`shipping-${shippingAddressId}`] = false;
    if (!isSameBillingAndShipping.value) return;
    selectedBillingAddress.value = shippingAddressId;
  },
});

const selectedBillingAddress = computed({
  get(): string {
    return activeBillingAddress.value?.id || "";
  },
  async set(billingAddressId: string) {
    isLoading[`billing-${billingAddressId}`] = true;
    await setActiveBillingAddress({ id: billingAddressId });
    if (billingAddressId === selectedShippingAddress.value)
      state.customShipping = false;
    isLoading[`billing-${billingAddressId}`] = false;
  },
});

const isCartLoading = computed(() => {
  return !cart.value;
});

const isCheckoutAvailable = computed(() => {
  return cartItems.value.length > 0;
});

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);

const state = reactive<any>({
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  guest: true,
  password: "",
  shippingAddress: {
    phoneNumber: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  },
  billingAddress: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    countryStateId: "",
  },
  customShipping: false,
  agree: false,
});

const terms = reactive({
  tos: false,
  revocation: false,
});

const termsBox = ref();

const rules = computed(() => ({
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  agree: {
    checked: (value: any) => value === true
  },
  password: {
    required: requiredIf(() => {
      return !state.guest;
    }),
    minLength: minLength(8),
  },
  billingAddress: {
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
  },
  shippingAddress: {
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
    countryStateId: {
      required: requiredIf(() => {
        return !!getStatesForCountry(state.billingAddress.countryId)?.length;
      }),
    },
  },
}));

const $v = useVuelidate(rules, state);

onMounted(async () => {
  await refreshSessionContext();

  isLoading["shippingAddress"] = true;
  isLoading["shippingMethods"] = true;
  isLoading["paymentMethods"] = true;

  Promise.any([
    loadCustomerAddresses(),
    !isVirtualCart.value ? getShippingMethods() : null,
    getPaymentMethods(),
  ]).finally(() => {
    isLoading["shippingAddress"] = false;
    isLoading["shippingMethods"] = false;
    isLoading["paymentMethods"] = false;
  });
});

watch(isLoggedIn, (v) => {
  if (v) {
    loadCustomerAddresses();
  }
})

const registerErrors = ref<ShopwareError[]>([]);

const placeOrder = async () => {
  isLoading["placeOrder"] = true;
  const order = await createOrder();
  isLoading["placeOrder"] = false;
  return push("/checkout/success/" + order.id);
};

const invokeSubmit = async () => {
  if (!isUserSession.value) {
    $v.value.$touch();
    registerErrors.value = [];
    const valid = await $v.value.$validate();
    if ($v.value.agree.$errors?.[0]) {
      const temp = document.getElementById('tac');
      temp?.scrollIntoView();
    }
    if (valid) {
      isLoading.all = true;
      try {
        await registerUser();
        await placeOrder();
      } finally {
        isLoading.all = false;
      }
    }
  } else {
    if (!isAgree.value) {
      isAgreeError.value = true;
      const temp = document.getElementById('tac');
      temp?.scrollIntoView();
      return;
    } else {
      isAgreeError.value = false;
    }
    isLoading.all = true;
    try {
      await placeOrder();
    } finally {
      isLoading.all = false;
    }
  }
};

const registerUser = async () => {
  try {
    state.shippingAddress.salutationId = state.salutationId;
    state.shippingAddress.firstName = state.firstName;
    state.shippingAddress.lastName = state.lastName;
    state.billingAddress.salutationId = state.salutationId;
    state.billingAddress.firstName = state.firstName;
    state.billingAddress.lastName = state.lastName;
    await register(state);
  } catch (error) {
    const e = error as ClientApiError;
    registerErrors.value = e.messages;
  }
}

async function invokeLogout() {
  await logout();
  await push("/");
}

watch(getSalutations, (salutations) => {
  if (!salutations?.length) return;
  const id = salutations?.[salutations.length -1]?.id;
  if (id) {
    state.salutationId = id;
  }
});

watch(isAgree, (v) => {
  if (v) {
    isAgreeError.value = false;
  }
})

watch(() => state.shippingAddress, (value) => {
  if (!isSameBillingAndShipping.value) return;
  state.billingAddress = {
    ...value,
    lastName: state.lastName,
    firstName: state.firstName
  };
}, {
  deep: true
});

watch(isSameBillingAndShipping, (value) => {
  if (value) {
    state.billingAddress = {
      ...state.shippingAddress,
      lastName: state.lastName,
      firstName: state.firstName
    };
  } else {
    state.billingAddress = {
      street: "",
      zipcode: "",
      city: "",
      countryId: "",
      phoneNumber: "",
      lastName: "",
      firstName: ""
    }
  }
});

watch(() => state.lastName, (value) => {
  if (isSameBillingAndShipping.value) {
    state.billingAddress.lastName = value;
  }
});

watch(() => state.firstName, (value) => {
  if (isSameBillingAndShipping.value) {
    state.billingAddress.firstName = value;
  }
});

const handleSubmit = () => {
  if (!isUserSession) {
    submitBtn.value.click();
  } else {
    invokeSubmit();
  }
}

const login = () => {
  modal.open('AccountLoginForm', {
    position: 'side'
  });
}

const handleChangeGuest = (e: any) => {
  state.guest = !e.target.checked;
}

const editAddress = (e: any, address: any) => {
  e.stopPropagation();
  modal.open('AccountAddressForm', {
    address,
    salutations: getSalutations,
    countries: getCountries,
    title: 'edit_address'
  })
}

const createAddress = (e: any) => {
  e.stopPropagation();
  modal.open('AccountAddressForm', {
    salutations: getSalutations,
    countries: getCountries,
    title: 'new_address'
  })
}

const getCountriesOptions = computed(() => {
  return getCountries.value?.map(x => ({
    label: x.translated.name,
    value: x.id
  })) ?? []
})

</script>

<template>
  <div class="mt-12 md:mt-16 mb-24">
    <div
      v-if="isCheckoutAvailable || isCartLoading"
      class="checkout-inner"
      :class="{
        'opacity-20': isCartLoading,
      }"
    >
      <div class="flex flex-col md:flex-row gap-16">
        <div class="flex-1">
          <!-- New User -->
          <form 
            v-if="!isUserSession"
            class="flex flex-col gap-10"
            id="checkout-billing-address"
            name="checkout-billing-address"
            method="post"
            @submit.prevent="invokeSubmit"
          >
            <div>
              <button
                type="button"
                class="flex items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800"
                @click="login"
                >
                {{ $t('log_in_to_your_account') }}
              </button>
            </div>
            <span class="text-base text-dark-variant">{{ $t('or_fill_the_details_below') }}</span>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('personal_information') }}</h6>
              <div class="flex flex-col gap-6">
                <div>
                  <div class="flex flex-col md:flex-row gap-6 mb-4">
                    <div class="flex-1">
                      <SharedInput 
                        :label="$t('first_name')" 
                        :label-required="true" 
                        v-model="state.firstName"
                        :errors="$v.firstName.$errors"
                        @blur="$v.firstName.$touch()"
                      />
                    </div>
                    <div class="flex-1">
                      <SharedInput 
                        :label="$t('last_name')" 
                        :label-required="true" 
                        v-model="state.lastName"
                        :errors="$v.lastName.$errors"
                        @blur="$v.lastName.$touch()"
                      />
                    </div>
                  </div>
                  <SharedCheckbox 
                    :content="$t('create_customer_account')"
                    :value="!state.guest"
                    @change="handleChangeGuest"
                  />
                </div>
                <div class="flex flex-col md:flex-row gap-6">
                  <div class="flex-1">
                    <SharedInput 
                      :label="$t('email_address')" 
                      :label-required="true" 
                      v-model="state.email"
                      :errors="$v.email.$errors"
                      @blur="$v.email.$touch()"
                    />
                  </div>
                  <div class="flex-1">
                    <SharedInput
                      v-if="!state.guest"
                      :label="$t('password')" 
                      v-model="state.password"
                      :errors="$v.password.$errors"
                      @blur="$v.password.$touch()"
                    />
                  </div>
                </div>
                <div>
                  <SharedInput
                    :label="$t('phone_number_optional')" 
                    v-model="state.shippingAddress.phoneNumber"
                  />
                </div>
                <div>
                  <SharedInput
                    :label="$t('street_address')" 
                    :label-required="true" 
                    :errors="$v.shippingAddress.street.$errors"
                    v-model="state.shippingAddress.street"
                  />
                </div>
                <div class="flex gap-4">
                  <div class="w-1/3">
                    <SharedInput
                      :label="$t('zip_code')" 
                      :label-required="true" 
                      :errors="$v.shippingAddress.zipcode.$errors"
                      v-model="state.shippingAddress.zipcode"
                    />
                  </div>
                  <div class="w-2/3">
                    <SharedInput
                      :label="$t('city')" 
                      :label-required="true" 
                      :errors="$v.shippingAddress.city.$errors"
                      v-model="state.shippingAddress.city"
                    />
                  </div>
                </div>
                <div>
                  <SwSelect
                    name="country"
                    :label="$t('country')"
                    :label-required="true"
                    :compact="false"
                    v-model="state.shippingAddress.countryId"
                    autocomplete="country-name"
                    :options="getCountriesOptions"
                    :placeholder="$t('choose_country_placeholder')"
                    :errors="$v.shippingAddress.countryId.$errors"
                  />
                </div>
                <SharedCheckbox 
                  :content="$t('use_same_for_billing_information')"
                  v-model="isSameBillingAndShipping"
                />
              </div>
            </div>
            <div class="border-b border-gray-200"></div>
            <template v-if="!isSameBillingAndShipping">
              <div>
                <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('different_billing_address') }}</h6>
                <div class="flex flex-col gap-6">
                  <div>
                    <SharedInput
                      name="billing-phone"
                      :label="$t('phone_number_optional')" 
                      v-model="state.shippingAddress.phoneNumber"
                      @blur="$v.shippingAddress.phoneNumber.$touch()"
                    />
                  </div>
                  <div>
                    <SharedInput
                      name="billing-address"
                      :label="$t('street_address')" 
                      v-model="state.shippingAddress.street"
                      :label-required="true"
                      :errors="$v.shippingAddress.street?.$errors"
                      @blur="$v.shippingAddress.street.$touch()"
                    />
                  </div>
                  <div class="flex gap-4">
                    <div class="w-1/3">
                      <SharedInput
                        name="zipcode"
                        :label="$t('zip_code')" 
                        v-model="state.shippingAddress.zipcode"
                        :label-required="true"
                        :errors="$v.shippingAddress.zipcode?.$errors"
                        @blur="$v.shippingAddress.zipcode.$touch()"
                      />
                    </div>
                    <div class="w-2/3">
                      <SharedInput
                        name="city"
                        :label="$t('city')" 
                        v-model="state.shippingAddress.city"
                        :label-required="true"
                        :errors="$v.shippingAddress.city?.$errors"
                        @blur="$v.shippingAddress.city.$touch()"
                      />
                    </div>
                  </div>
                  <div>
                    <SwSelect
                      name="country"
                      :label="$t('country')"
                      :label-required="true"
                      :compact="false"
                      v-model="state.billingAddress.countryId"
                      :options="getCountriesOptions"
                      :placeholder="$t('choose_country_placeholder')"
                      :errors="$v.shippingAddress.countryId.$errors"
                      @blur="$v.shippingAddress.countryId.$touch()"
                    />
                  </div>
                </div>
              </div>
              <div class="border-b border-gray-200"></div>
            </template>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{  $t('shipping_method') }}</h6>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="singleShippingMethod in shippingMethods"
                  :key="singleShippingMethod.id"
                  class="shadow-sm relative"
                  :class="selectedShippingMethod === singleShippingMethod.id ? 'border-2 border-gray-500' : 'border border-gray-300'"
                >
                  <input
                    :id="singleShippingMethod.id"
                    v-model="selectedShippingMethod"
                    :value="singleShippingMethod.id"
                    name="shipping-method"
                    type="radio"
                    class="focus:ring-brand-primary h-4 w-4 border-gray-300 hidden"
                    :data-testid="`checkout-shipping-method-${singleShippingMethod.id}`"
                  />
                  <label
                    :for="singleShippingMethod.id"
                    :class="{ 'animate-pulse': isLoading[singleShippingMethod.id] }"
                    class="p-4 block text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <p>{{ (singleShippingMethod as any).translated.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{(singleShippingMethod.deliveryTime as any)?.translated?.name}}
                    </p>
                    <br/>
                    <!-- <SharedPrice :value="(singleShippingMethod.prices?.[0] as any)?.currencyPrice?.[0].gross || 0" data-testid="cart-subtotal" /> -->
                  </label>
                  <CheckCircleIcon v-if="selectedShippingMethod === singleShippingMethod.id" class="text-gray-600 absolute top-4 right-4 h-5 w-5" />
                </li>
              </ul>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('payment_method') }}</h6>
              <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
                <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
                  <div class="w-4 bg-gray-300 h-4 rounded-full" />
                  <div class="flex flex-col space-y-3">
                    <div class="w-36 bg-gray-300 h-6 rounded-md" />
                    <div class="w-24 bg-gray-300 h-6 rounded-md" />
                  </div>
                </div>
              </div>
              <form v-else>
                <RadioGroup
                  v-model="selectedPaymentMethod"
                  class="border border-gray-200"
                >
                  <RadioGroupOption
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id"
                    :value="paymentMethod.id"
                    v-slot="{ checked }"
                  >
                    <div
                      :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                      class="relative flex cursor-pointer rounded-lg p-4"
                    >
                      <div>
                        <span
                          :class="[
                          checked
                            ? 'bg-gray-800 border-transparent'
                            : 'bg-white border-gray-300',
                          ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                        ]"
                          aria-hidden="true"
                        >
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      </div>
                      <div>
                        <RadioGroupLabel class="block cursor-pointer">
                          <h6 class="block text-sm font-medium text-gray-900">{{ paymentMethod.translated?.name }}</h6>
                          <p class="text-gray-700 text-sm">
                            {{ paymentMethod.translated?.description }}
                          </p>
                        </RadioGroupLabel>
                      </div>
                    </div>

                    <div class="w-full border-b border-b-gray-200" />
                  </RadioGroupOption>
                </RadioGroup>
              </form>
            </div>
            <div class="border-b border-gray-200"></div>
            <div id="tac">
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('terms_and_conditions') }}</h6>
              <SharedCheckbox
                :error="!!$v.agree.$errors[0]"
                v-model="state.agree"
                content="I have read and accepted the <a class='underline underline-offset-2' href='https://shopware-6-demo.shop-studio.io/widgets/cms/7c7e4047d6df467ca9f5c7f1611fe4e6'>terms and conditions</a>." />
            </div>
            <button ref="submitBtn" type="submit" class="hidden">submit</button>
          </form>
          <!-- Existed User -->
          <div 
            v-else 
            class="flex flex-col gap-10"
          >
            <div class="flex gap-2 items-center">
              <span class="text-base text-dark-variant">{{$t('you_are_logged_in_as', [user?.firstName, user?.lastName]) }}</span>
              <button
                type="button"
                class="flex items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800"
                @click="invokeLogout"
              >
                {{ $t('log_out') }}
              </button>
            </div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('shipping_address') }}</h6>
              <div class="flex flex-col gap-4">
                <div>
                  <RadioGroup
                    v-model="selectedShippingAddress"
                    class="border border-gray-200"
                  >
                    <RadioGroupOption
                      class="cursor-pointer"
                      v-for="customerAddress in customerAddresses"
                      :key="customerAddress.id"
                      :value="customerAddress.id"
                      v-slot="{ checked }"
                    >
                      <div
                        :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                        class="relative flex cursor-pointer rounded-lg p-4"
                      >
                        <div>
                          <span
                            :class="[
                            checked
                              ? 'bg-gray-800 border-transparent'
                              : 'bg-white border-gray-300',
                            ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                          ]"
                            aria-hidden="true"
                          >
                          <span class="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                        </div>
                        <div>
                          <RadioGroupLabel class="block cursor-pointer">
                            <h6 class="block text-sm font-medium text-gray-900">{{ `${customerAddress.firstName} ${customerAddress.lastName}` }}</h6>
                            <p class="text-gray-700 text-sm">
                              <span class="block">{{ customerAddress.street }}</span>
                              <span class="block">{{ customerAddress.zipcode }}</span>
                              <span class="block">{{ customerAddress.city }}</span>
                            </p>
                          </RadioGroupLabel>
                          <PencilSquareIcon class="cursor-pointer absolute top-4 right-4 h-6 w-6 text-gray-900" @click="(e: any) => editAddress(e, customerAddress)" />
                        </div>
                      </div>
  
                      <div class="w-full border-b border-b-gray-200" />
                    </RadioGroupOption>
                  </RadioGroup>
                </div>
                <div>
                  <button
                    type="button"
                    class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white shadow-sm bg-gray-800"
                    @click="createAddress"
                  >
                    {{ $t('add_new_shipping_address') }}
                  </button>
                </div>
                <div>
                  <SharedCheckbox 
                    :content="$t('use_same_for_billing_information')"
                    v-model="isSameBillingAndShipping"
                  />
                </div>
              </div>
            </div>
            <div class="border-b border-gray-200"></div>
            <div v-if="!isSameBillingAndShipping">
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('billing_address') }}</h6>
              <div class="flex flex-col gap-4">
                <div>
                  <RadioGroup
                    v-model="selectedBillingAddress"
                    class="border border-gray-200"
                  >
                    <RadioGroupOption
                      v-for="customerAddress in customerAddresses"
                      :key="customerAddress.id"
                      :value="customerAddress.id"
                      v-slot="{ checked }"
                    >
                      <div
                        :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                        class="relative flex cursor-pointer rounded-lg p-4"
                      >
                        <div>
                          <span
                            :class="[
                            checked
                              ? 'bg-gray-800 border-transparent'
                              : 'bg-white border-gray-300',
                            ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                          ]"
                            aria-hidden="true"
                          >
                          <span class="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                        </div>
                        <div>
                          <RadioGroupLabel class="block cursor-pointer">
                            <h6 class="block text-sm font-medium text-gray-900">{{ `${customerAddress.firstName} ${customerAddress.lastName}` }}</h6>
                            <p class="text-gray-700 text-sm">
                              <span class="block">{{ customerAddress.street }}</span>
                              <span class="block">{{ customerAddress.zipcode }}</span>
                              <span class="block">{{ customerAddress.city }}</span>
                            </p>
                          </RadioGroupLabel>
                          <PencilSquareIcon class="cursor-pointer absolute top-4 right-4 h-6 w-6 text-gray-900" @click="(e: any) => editAddress(e, customerAddress)" />
                        </div>
                      </div>
  
                      <div class="w-full border-b border-b-gray-200" />
                    </RadioGroupOption>
                  </RadioGroup>
                </div>
                <div>
                  <button
                    type="button"
                    class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white shadow-sm bg-gray-800"
                    @click="createAddress"
                  >
                    {{$t('add_new_billing_address')}}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="!isSameBillingAndShipping" class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('shipping_method') }}</h6>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="singleShippingMethod in shippingMethods"
                  :key="singleShippingMethod.id"
                  class="shadow-sm relative"
                  :class="selectedShippingMethod === singleShippingMethod.id ? 'border-2 border-gray-500' : 'border border-gray-300'"
                >
                  <input
                    :id="singleShippingMethod.id"
                    v-model="selectedShippingMethod"
                    :value="singleShippingMethod.id"
                    name="shipping-method"
                    type="radio"
                    class="focus:ring-brand-primary h-4 w-4 border-gray-300 hidden"
                    :data-testid="`checkout-shipping-method-${singleShippingMethod.id}`"
                  />
                  <label
                    :for="singleShippingMethod.id"
                    :class="{ 'animate-pulse': isLoading[singleShippingMethod.id] }"
                    class="p-4 block text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <p>{{ (singleShippingMethod as any).translated.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{(singleShippingMethod.deliveryTime as any)?.translated?.name}}
                    </p>
                    <br/>
                    <!-- <SharedPrice :value="(singleShippingMethod.prices?.[0] as any)?.currencyPrice?.[0].gross || 0" /> -->
                  </label>
                  <CheckCircleIcon v-if="selectedShippingMethod === singleShippingMethod.id" class="text-gray-600 absolute top-4 right-4 h-5 w-5" />
                </li>
              </ul>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('payment_method') }}</h6>
              <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
                <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
                  <div class="w-4 bg-gray-300 h-4 rounded-full" />
                  <div class="flex flex-col space-y-3">
                    <div class="w-36 bg-gray-300 h-6 rounded-md" />
                    <div class="w-24 bg-gray-300 h-6 rounded-md" />
                  </div>
                </div>
              </div>
              <form v-else>
                <RadioGroup
                  v-model="selectedPaymentMethod"
                  class="border border-gray-200"
                >
                  <RadioGroupOption
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id"
                    :value="paymentMethod.id"
                    v-slot="{ checked }"
                  >
                    <div
                      :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                      class="relative flex cursor-pointer rounded-lg p-4"
                    >
                      <div>
                        <span
                          :class="[
                          checked
                            ? 'bg-gray-800 border-transparent'
                            : 'bg-white border-gray-300',
                          ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                        ]"
                          aria-hidden="true"
                        >
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      </div>
                      <div>
                        <RadioGroupLabel class="block cursor-pointer">
                          <h6 class="block text-sm font-medium text-gray-900">{{ paymentMethod.translated?.name }}</h6>
                          <p class="text-gray-700 text-sm">
                            {{ paymentMethod.translated?.description }}
                          </p>
                        </RadioGroupLabel>
                      </div>
                    </div>

                    <div class="w-full border-b border-b-gray-200" />
                  </RadioGroupOption>
                </RadioGroup>
              </form>
            </div>
            <div class="border-b border-gray-200"></div>
            <div id="tac">
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('terms_and_conditions') }}</h6>
              <SharedCheckbox
                :error="isAgreeError"
                v-model="isAgree"
                content="I have read and accepted the <a class='underline underline-offset-2' href='https://shopware-6-demo.shop-studio.io/widgets/cms/7c7e4047d6df467ca9f5c7f1611fe4e6'>terms and conditions</a>." />
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:max-w-[574px]">
          <h5 class="text-lg font-medium text-dark-primary mb-4">{{ $t('order_summary') }}</h5>
          <SharedOrdersSummary :showCartItems="true" :preventLastItem="true">
            <template #action>
              <button
                class="mt-6 w-full flex items-center justify-center px-5 py-3 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-70"
                :disabled="isLoading.all"
                @click="handleSubmit"
              >
                {{ $t('confirm_order') }}
              </button>
            </template>
          </SharedOrdersSummary>
          <SharedValueProposition class="mt-6" :isColumn="true" />
        </div>
      </div>
    </div>
    <div v-else class="mt-40 flex-1 h-full items-center text-center flex flex-col justify-center">
      <h4 class="mb-2 font-medium text-2xl text-dark-primary">{{ $t('your_cart_empty') }}</h4>
      <p class="mb-6 text-base text-gray-500">{{  $t('your_cart_empty_desc') }}</p>
      <div>
        <nuxt-link to="/" class="bg-gray-100 shadow-sm px-6 py-3 text-base font-medium">{{ $t('start_shopping') }}</nuxt-link>
      </div>
    </div>
  </div>
</template>
