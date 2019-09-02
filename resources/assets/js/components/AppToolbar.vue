<template>
  <v-toolbar app clipped-left fixed height="58" class="header-app white--text elevation-1">
    <v-toolbar-side-icon v-if="authUser.role" class="white--text" @click.stop="toggleDrawer"></v-toolbar-side-icon>
    <v-toolbar-title v-if="authUser.role">TRITON</v-toolbar-title>
    <v-toolbar-title v-if="!authUser.role">Trabajando</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu offset-y v-if="authUser.role">
      <template v-slot:activator="{ on }">
        <div class="avatar-toggle px-2" v-on="on">
          {{ authUser.username }}
          <v-avatar size="40">
            <v-icon dark>account_circle</v-icon>
          </v-avatar>
        </div>
      </template>
      <v-list class="py-0">
        <v-list-tile @click.stop="isLogout = true">
          <v-list-tile-title @>Salir</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <div v-if="!authUser.role" style="    text-align: center;display: flex;flex-flow: column;align-items: center;height: 50px;
">
      <img src="/images/icons/end.png" alt="" width="30" @click.stop="isLogout = true">
      <span>FINALIZAR</span>
    </div>
    <v-dialog v-model="isLogout" max-width="290">
      <v-card>
        <v-card-title class="headline" v-if="authUser.role">Salir</v-card-title>
        <v-card-title class="headline" v-if="!authUser.role">Finalizar Jornada</v-card-title>

        <v-card-text v-if="authUser.role">
          ¿Estás seguro que salir?
        </v-card-text>
        <v-card-text v-if="!authUser.role">
          ¿Estás seguro que deseas finalizar tu jornada laboral del dia de hoy?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" flat="flat" @click="isLogout = false">
            Cancelar
          </v-btn>

          <v-btn color="green darken-1" flat="flat" @click="logout">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
export default {
  props: ['title'],
  data: () => ({
    isLogout: false
  }),
  computed: {
    authUser() { return this.$store.state.auth.authUser }
  },
  methods: {
    toggleDrawer() {
      this.$store.commit('TOGGLE_DRAWER')
    },
    logout() {
      if (this.authUser.role) {
        this.$store.dispatch('auth/logoutAdmin').then(() => {
          this.$router.push('/admin/login')
        })
      } else {
        this.$store.dispatch('auth/logoutEmployee').then((result) => {
          if (result) {
            this.$router.push('/')
            this.$store.commit('activities/SET_ACTIVE', null)
          }
        })
      }
    }
  }
}
</script>

<style>
  .avatar-toggle {
    cursor: pointer;
  } 
  .header-app {
    background-color: #04091e !important;
  }
</style>
