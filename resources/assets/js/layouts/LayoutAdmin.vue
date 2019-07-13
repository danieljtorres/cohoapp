<template>
  <v-app>
    <AppDrawer/>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <AppToolbar/>
  </v-app>
</template>

<script>

export default {
}
</script>