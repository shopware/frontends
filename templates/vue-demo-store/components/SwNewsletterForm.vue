<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { CmsElementForm } from "@shopware-pwa/composables-next";
import { ClientApiError } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsElementForm;
}>();
const loading = ref<boolean>();
const formSent = ref<boolean>(false);
const errorMessages = ref<any[]>([]);
const subscriptionOptions: {
  label: string;
  value: "subscribe" | "unsubscribe";
}[] = [
  {
    label: "Subscribe to newsletter",
    value: "subscribe",
  },
  {
    label: "Unsubscribe to newsletter",
    value: "unsubscribe",
  },
];
const { getSalutations } = useSalutations();
const { getConfigValue } = useCmsElementConfig(props.content);
const { newsletterSubscribe, newsletterUnsubscribe } = useNewsletter();

const getFormTitle = computed(() => getConfigValue("title"));
const state = reactive({
  option: subscriptionOptions[0].value,
  email: "",
});

const rules = computed(() => {
  let temp: any = {
    email: {
      required,
      email,
    },
  };
  return temp;
});

const $v = useVuelidate(rules, state);
const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    loading.value = true;
    try {
      if (state.option === "subscribe") {
        await newsletterSubscribe({
          ...state,
        });
      } else {
        await newsletterUnsubscribe(state.email);
      }
      formSent.value = true;
    } catch (e) {
      errorMessages.value = (e as ClientApiError).messages;
    } finally {
      loading.value = false;
    }
  }
};
</script>
<template>
  <div class="bg-brand-dark">
    <form class="flex flex-col md:flex-row container mx-auto text-white w-full relative py-12 md:py-18 md:items-center" @submit.prevent="invokeSubmit">
      <div class="w-full md:w-7/12">
        <h2 class="p-0 mb-3 text-2xl md:text-3xl">
          {{
            getFormTitle
              ? getFormTitle
              : state.option === "subscribe"
              ? "Subscribe to newsletter"
              : "Unsubscribe to newsletter"
          }}
        </h2>
        <p class="text-gray-300 text-lg">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.</p>
      </div>
      <template v-if="!formSent">
        <div class="w-full pl-0 pt-8 md:pt-0 md:w-5/12 md:pl-22">
          <div class="flex flex-col md:flex-row gap-3">
            <div class="flex-1">
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                :class="[
                  $v.email.$error
                    ? 'border-red-600 focus:border-red-600'
                    : 'border-gray-300 focus:border-indigo-500',
                ]"
                v-model="state.email"
                @blur="$v.email.$touch()"
                class="appearance-none relative block w-full px-3 py-2 border placeholder:text-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <span
                v-if="$v.email.$error"
                class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
              >
                {{ $v.email.$errors[0].$message }}
              </span>
            </div>
            <div class="flex-1 md:flex-initial">
              <button
                class="w-full group relative flex justify-center py-2 px-4 border border-white text-sm font-medium bg-white hover:bg-gray-100 hover:border-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75"
                type="submit"
                :disabled="loading"
              >
                Subscribe
              </button>
            </div>
          </div>
          <p class="mt-3 text-sm text-gray-300">
            {{$t('newsletter_success_text')}} <a class="text-white border-b">{{ $t('privacy_policy') }}</a>
          </p>
        </div>
      </template>
      <template v-else>
        <p class="py-10 text-lg text-center">
          Be aware of upcoming sales and events. Receive gifts and special offers!
        </p>
      </template>
    </form>
  </div>
</template>
