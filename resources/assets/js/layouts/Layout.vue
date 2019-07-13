<template>
  <v-app>
    <v-content>
      <v-container fluid class="pa-0">
        <router-view></router-view>
      </v-container>
    </v-content>
    <AppToolbar/>
    <v-footer class="pa-3">
      <div style="width: 100%" class="text-xs-center">{{ date }}</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  created() {
    let date
    this.timer = setInterval(() => {
      date = this.$moment().format('dddd, D [de] MMMM YYYY, h:mm:ss a')
      this.date = date.charAt(0).toUpperCase() + date.slice(1);
    }, 500)
  },
  data: () => ({
    date: ''
  })
}
</script>