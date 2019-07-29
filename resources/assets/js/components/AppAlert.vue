<template>
  <v-snackbar
    v-model="snackbar"
    bottom
    :timeout="8000"
  >
    {{ text }}
    <v-btn
      color="white"
      flat
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>