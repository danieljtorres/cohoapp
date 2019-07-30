<template>
  <v-navigation-drawer class="elevation-1" app clipped fixed width="200" floating v-model="drawer">
    <v-list dense class="pt-0">
      <v-list-tile :exact="true"
        v-for="item in items"
        :key="item.title"
        :to="item.link"
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
      { title: 'Inicio', icon: 'dashboard', link: '/admin' },
      { title: 'Administradores', icon: 'people', link: '/admin/administradores' },
      { title: 'Empleados', icon: 'people_outline', link: '/admin/empleados' },
      //{ title: 'Categorias Laborales', icon: 'work', link: '/admin/categorias-laborales' },
      //{ title: 'Actividades', icon: 'work_outline', link: '/admin/actividades' }
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