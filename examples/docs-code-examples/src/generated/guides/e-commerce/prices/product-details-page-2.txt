<template>
  <div>
    <table v-if="tierPrices.length">
      <!-- check if tierPrices array is not empty -->
      <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
        <td>
          <span v-if="index < tierPrices.length - 1"> To </span>
          <span v-else> From </span>
          {{ tierPrice.quantity }}
        </td>
        <td>{{ tierPrice.totalPrice }} $</td>
      </tr>
    </table>
    <div v-else>
      <!-- show the regular unit price instead -->
      {{ totalPrice }} $
    </div>
  </div>
</template>
