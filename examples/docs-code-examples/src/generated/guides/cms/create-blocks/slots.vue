<!-- components/cms/CmsBlockImageThreeColumn.vue -->
<template>
    <div class="grid grid-cols-3">
        <CmsGenericElement
            :content="props.content.slots.filter(
                (slot) => slot.slot === 'left')
            " />
        <CmsGenericElement
            :content="props.content.slots.filter(
                (slot) => slot.slot === 'center')
            " />
        <CmsGenericElement
            :content="props.content.slots.filter(
                (slot) => slot.slot === 'right')
            " />
    </div>
</template>
