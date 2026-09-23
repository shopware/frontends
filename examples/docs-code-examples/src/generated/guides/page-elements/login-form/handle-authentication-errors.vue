<template>
    <div v-if="!isLoggedIn">
        <div v-if="errors.login.length">
            {{ errors.login[0].detail }}
        </div>
    </div>
</template>
