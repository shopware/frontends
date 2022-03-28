<script setup lang="ts">
import { useAddToCart, useSessionContext } from "@shopware-pwa/composables";
import { getTranslatedProperty, getProductMediaGallery } from "@shopware-pwa/helpers"
import { getProductReviews } from "@shopware-pwa/shopware-6-client";

const cms = inject("cms-page");
const reviews = ref([]);
const product = computed(() => cms.value.product)
const { replace  } = useRouter();
const { addToCart, quantity } = useAddToCart({product: unref(product)});
const { currency, refreshSessionContext } = useSessionContext();
refreshSessionContext();
const isStaticLayout = computed( () => !cms.value?.cmsPage)
const description = computed(() =>
    getTranslatedProperty(product.value, "description")
  )
const name = computed(() =>
    getTranslatedProperty(product.value, "name")
  )
const regularPrice = computed(() => product.value?.calculatedPrice?.unitPrice)
const coverImageUrl = computed(() => product.value?.cover?.media?.url);
const mediaGallery =  computed( () => 
      getProductMediaGallery({ product: product.value })
  );
const properties = computed(() => product.value?.properties || [])

onMounted(async () => {
  const reviewsResponse = await getProductReviews(product.value.id);
  reviews.value = reviewsResponse?.elements || [];
})

const isOptionSelected = (optionId: string) => Object.values(getSelectedOptions.value).includes(optionId)
const {
    isLoadingOptions,
    handleChange,
    getOptionGroups,
    getSelectedOptions,
    findVariantForSelectedOptions,
  } = useProductConfigurator({ product: unref(product) })

const selectedOptions = computed(() => Object.values(unref(getSelectedOptions)))

const redirectToSelectedVariantUrl = async () => { 
    const selectedOption = await findVariantForSelectedOptions(unref(selectedOptions))
    const selectedOptionsVariantPath = selectedOption?.seoUrls?.[0]?.seoPathInfo
    if (selectedOptionsVariantPath) {
      const route = useRoute();
      const currentPath = route.path;
      const newPathForVariant = window.location.href.replace(currentPath, "/"+selectedOptionsVariantPath)
      try {
        new URL(newPathForVariant)
        window.location.href = newPathForVariant;
      } catch (error) {
        console.error('incorrect URL', newPathForVariant);
      }
    }
}


</script>
<template>
<div class="container mx-auto bg-white flex flex-row ">
  <template v-if="isStaticLayout">
    
<!-- Image gallery -->
    <div class="product-gallery lg:basis-3/5">
      <div class="mt-6 hidden aspect-w-1 aspect-h-4 rounded-lg overflow-hidden lg:block lg:px-8">
        <div class="hidden lg:grid lg:grid-cols-1 lg:gap-x-8 lg:gap-y-8 mb-9 rounded-lg overflow-hidden" >
          <img :src="coverImageUrl" alt="Two each of gray, white, and black shirts laying flat." class="w-full h-full object-center object-cover">
        </div>
        <div class="hidden lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
          <div v-for="image in mediaGallery" :key="image.icon.url" class="rounded-lg overflow-hidden">
            <img :src="image.icon.url" alt="Model wearing plain black basic tee." class="w-full h-full object-center object-cover">
          </div>
        </div>
      </div>
    </div>
   
      <div class="product-description lg:basis-2/5">
        <!-- Product info -->
        <div class="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-1 lg:grid-rows-[auto] lg:gap-x-8">
          <div class="lg:col-span-2 lg:pr-8 flex flex-row">
            <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl basis-4/6">{{ name }}</h1>
            <p class="text-3xl text-gray-900 basis-2/6 text-right">{{regularPrice}} {{currency?.symbol}}</p>
          </div>

          <!-- Options -->
          <div class="mt-4 lg:mt-0 lg:row-span-3">
            <h2 class="sr-only">Product information</h2>
            <form class="product-variants mt-10">
              <div v-for="optionGroup in getOptionGroups" :key="optionGroup.id" class="mt-6">
                <h3 class="text-sm text-gray-900 font-medium">{{ optionGroup.name}}</h3>
                <fieldset class="mt-4">
                    <legend class="sr-only">Choose a {{ optionGroup.name}}</legend>
                    <div class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    <label class="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer" v-for="option in optionGroup.options" :key="option.id"  @click="handleChange(optionGroup.name, option.id, redirectToSelectedVariantUrl)">
                          
                          <input type="radio" :name="`${option.id}-choice`" :value="option.name" class="sr-only" :aria-labelledby="`${option.id}-choice-label`">
                          <p :id="`${option.id}-choice-label`">{{ option.name }}</p>
                          <div class="absolute -inset-px rounded-md pointer-events-none" :class="{'border border-cyan-600': isOptionSelected(option.id)}"></div>
                        </label>

                    
                    </div>
                </fieldset>
                  
              </div>
              <div class="flex flex-row  mt-10">
                <div class="basis-1/4">
                  <input type="number" v-model="quantity" min="1" class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full"/>
                </div>
                <div class="basis-3/4 ml-4">
                  <a @click="addToCart" class="py-2 px-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 transition ease-in-out hover:bg-gradient-to-l duration-300 cursor-pointer border border-transparent  rounded-md flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add to bag</a>
                </div>
              </div>
              
            </form>
          </div>

          <div class="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:pr-8">
            <!-- Description and details -->
            <div v-if="description">
              <h3 class="text-sm font-medium text-gray-900">Description</h3>

              <div class="mt-4 space-y-6">
                <p class="text-base text-gray-900" v-html="description"></p>
              </div>
            </div>

            <div class="mt-10"  v-if="properties.length">
              <h3 class="text-sm font-medium text-gray-900">Properties</h3>

              <div class="mt-4">
                <ul role="list" class="pl-4 list-disc text-sm space-y-2">
                  <li v-for="property in properties" :key="property.id" class="text-gray-400"><span class="text-gray-600">{{property.translated?.name}}</span></li>
                </ul>
              </div>
            </div>

             <div class="mt-10"  v-if="reviews.length">
              <h3 class="text-sm font-medium text-gray-900">Reviews</h3>
              <div class="mt-4" v-if="reviews.length">
                <ul role="list" class="pl-4 list-disc text-sm space-y-2">
                  <li v-for="review in reviews" :key="review.id" class="text-gray-400"><span class="text-gray-600">{{review.content}}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  </template>
</div>
</template>