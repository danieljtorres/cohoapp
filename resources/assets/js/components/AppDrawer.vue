<template>
  <v-navigation-drawer app clipped fixed width="200" floating v-model="drawer">
    <v-list dense class="pt-0">
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        @click=""
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Inicio', icon: 'dashboard' },
      { title: 'About', icon: 'question_answer' }
    ]
  }),
  computed: {
    drawer: { 
      get: function() { return this.$store.state.drawer },
      set: function(newVal) { if (newVal == false) this.$store.commit('TOGGLE_DRAWER', newVal) }
    }
  }
}
</script>