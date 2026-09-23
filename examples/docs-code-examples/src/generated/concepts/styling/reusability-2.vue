<!--- ImageContainer.vue -->
<script setup>
defineProps(['images'])
</script>

<template>
    <ImageCircle v-for="image in images" :imageSrc="image">
</template>
