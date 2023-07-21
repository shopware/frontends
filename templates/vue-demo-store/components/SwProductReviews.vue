<script setup lang="ts">
import { Product, ProductReview } from "@shopware-pwa/types";
import SharedReviews from './shared/SharedReviews.vue';
import { format } from "date-fns";
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/vue/20/solid';
import { SharedModal } from "./shared/SharedModal.vue";
import { ReviewStar } from "~~/models/enum";

const props = defineProps<{
  product: Product;
  reviews?: ProductReview[];
  customerReview?: ProductReview;
  ratingMatrix? : any;
}>();
const { product, reviews } = toRefs(props);
const modal = inject<SharedModal>("modal") as SharedModal;
const shouldLoadReviews = !reviews?.value;
const { isLoggedIn, user } = useUser();
const loadingReviews = ref<boolean>(shouldLoadReviews);
const isAddReview = ref<boolean>(false);
const justAddedReview = ref<boolean>(false);
const isDisplayReviewsInCurrentLanguage = ref<boolean>(false);
const { currentLanguage } = useLanguage();
const { loadProductReviews, productReviews } = useProductReviews(product);
const filterRating = ref({
  5: false,
  4: false,
  3: false,
  2: false,
  1: false
});

onMounted(async () => {
  shouldLoadReviews && (await loadProductReviews());
  loadingReviews.value = false;
});

const reviewsList = computed<ProductReview[]>(
  () => {
    let list: ProductReview[] = [];
    if (reviews?.value?.length) {
      list = reviews?.value;
    }
    if (productReviews.value?.length) {
      productReviews.value.forEach(productReview => {
        const indx = list.findIndex(x => x.id === productReview.id);
        list[indx] = productReview;
      })
      list = [...list];
    }
    const getRatingFilter = Object.entries(filterRating.value)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => +key);
    if (getRatingFilter.length) {
      list = list.filter(x => getRatingFilter.includes(+x.points));
    }
    if (isDisplayReviewsInCurrentLanguage.value) {
      list = list.filter(x => x.languageId === currentLanguage.value.id);
    }
    return list;
  }
);

const onHandleReview = () => {
  if (isAddReview.value) {
    isAddReview.value = false;
  } else {
    if (isLoggedIn.value) {
      isAddReview.value = true;
    } else {
      modal.open('AccountLoginForm');
    }
  }
};

const handleCancel = () => {
  isAddReview.value = false;
};

const handleSubmit = async () => {
  isAddReview.value = false;
  justAddedReview.value = true;
  await loadProductReviews();
  setTimeout(() => {
    justAddedReview.value = false;
  }, 5000);
}

const getMatrixPercent = (index: number) => {
  const total = props.ratingMatrix.reduce((sum: number, x: any) => {
    sum = sum + +x.count;
    return sum;
  }, 0);
  const currentReview = props.ratingMatrix.find((x: any) => +x.key === 5 - index)?.count || 0;
  return total ? ((currentReview / total) * 100) : 0;
}

const formatDate = (date: string) => format(new Date(date), 'd LLL yyyy');
const reviewStars = computed(() => {
  return Object.values(ReviewStar).filter((v) => isNaN(Number(v))).reverse();
});

const checkboxChange = (reviewStar: number, e: boolean) => {
  filterRating.value = {
    ...filterRating.value,
    [reviewStar]: e
  }
}

const customerHaveReview = computed(() => isLoggedIn.value && props.customerReview)
</script>

<template>
  <div
    v-if="loadingReviews"
    class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"
  >
    <div
      class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
    />
  </div>
  <div class="flex gap-4 md:gap-8">
    <div class="w-1/3">
      <h4 class="text-base font-bold mb-2">{{ $t('of_reviews', [reviewsList?.length, reviewsList?.length]) }}</h4>
      <SharedReviews :product="product" :numberOfReviews="reviewsList.length"/>
      <div v-if="reviewsList?.length" class="border-y border-gray-300 my-8 py-4">
        <div class="flex py-2 justify-between items-center" v-for="(reviewStar, index) of reviewStars">
          <SharedCheckbox @update:model-value="(e) => checkboxChange(5 - index, e)" class="w-1/4" :content="$t(reviewStar as string)" :disabled="!getMatrixPercent(index)" />
          <div class="w-2/3 flex justify-between items-center">
            <div class="w-full h-3 bg-neutral-200 dark:bg-neutral-600">
              <div class="h-3 bg-brand-primary" :style="{
                width: `${getMatrixPercent(index)}%`
              }"></div>
            </div>
            <span class="w-[70px] text-end">{{ getMatrixPercent(index) }}%</span>
          </div>
        </div>
      </div>
      <h5 class="text-lg font-bold mb-2">{{ !customerHaveReview ? $t('leave_a_review') : $t('edit_your_review') }}</h5>
      <p class="text-sm mb-4">{{ $t('share_exp') }}</p>
      <button 
        class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white shadow-sm bg-gray-800"
        @click="onHandleReview"
      >
        {{ !isAddReview ? (customerHaveReview ? $t('edit_review') : $t('write_review')) : $t('show_review') }}
      </button>
    </div>
    <div class="w-2/3">
      <div v-if="justAddedReview" class="rounded-md bg-green-50 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleSolidIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div class="ml-3 text-sm text-green-700">
            <p>{{ $t('thanks_for_review') }}</p>
          </div>
        </div>
      </div>
      <SharedCheckbox v-model="isDisplayReviewsInCurrentLanguage" class="my-4" :content="$t('display_reviews_current_lang')" />
      <div class="mb-4 border-b border-gray-3"></div>
      <template v-if="!isAddReview">
        <template v-if="!reviewsList?.length">
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <InformationCircleIcon class="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700">{{ $t('no_reviews') }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="py-4 mb-6 shadow-[0px_1px_0px_#F1F2F3]" v-for="review in reviewsList" :key="review.id">
            <div class="flex flex-col gap-2">
              <div class="rounded-md bg-yellow-50 p-4" v-if="!review.status">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3 flex-1 md:flex md:justify-between">
                    <p class="text-sm text-yellow-800">{{ $t('your_review_has_not_approved') }}</p>
                  </div>
                </div>
              </div>
              <p class="text-gray-500">{{ formatDate(review.createdAt) }}</p>
              <h6 class="text-base font-normal flex gap-1 items-center">
                <SwRating class="justify-end" :rating="review.points" />
                <span class="font-medium">{{ review.title }}</span>
              </h6>
            </div>
            <p class="mt-4 font-normal text-base break-words">
              {{ review.content }}
            </p>
          </div>
        </template>
      </template>
      <template v-else>
        <SwAddReview :data="customerHaveReview ? props.customerReview : null" :editMode="!!customerHaveReview" :product="product" @cancel="handleCancel" @submit="handleSubmit" />
      </template>
    </div>
  </div>
</template>
