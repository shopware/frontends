<script setup>
import { getCategoryUrl, getTranslatedProperty } from "@shopware-pwa/helpers"
import { getStoreNavigation } from "@shopware-pwa/shopware-6-client"
import { useCms, getApplicationContext } from "@shopware-pwa/composables"
const { apiInstance } = getApplicationContext({
    contextName: "CmsElementCategoryNavigation",
})
const { page } = useCms() // fallback for provide/inject, remove in future
const cmsPage = inject("cms-page", page)
const resourceIdentifier = computed(() => cmsPage.value?.resourceIdentifier)

const navigationElements = ref([])


onMounted(async () => {
    try {
        const response = await getStoreNavigation(
            {
                requestActiveId: resourceIdentifier.value,
                requestRootId: resourceIdentifier.value,
            },
            apiInstance
        )
        navigationElements.value = response
    } catch (error) {
        console.warn(
            "CmsElementCategoryNavigation:onMounted:getStoreNavigation",
            error.messages
        )
    }
})

</script>

<template>
    <nav class="container mx-auto mt-8">
        <ul>
            <li v-for="(navigationElement, index) in navigationElements" :key="index">
                <router-link :to="getCategoryUrl(navigationElement)">
                    {{ getTranslatedProperty(navigationElement, "name") }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>