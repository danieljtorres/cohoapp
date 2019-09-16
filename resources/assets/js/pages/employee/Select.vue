<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <form @submit.prevent="handleLoginSubmit">
          <v-layout align-center justify-center fill-height>
            <v-flex xs10 md4>
              <div class="py-5"></div>
                <v-layout align-center justify-center row wrap fill-height>
                    <v-flex xs12 text-xs-center>
                    <v-select :items="categories" @input="setCategory" :value="category_id" item-text="name" item-value="id" label="Categoria laboral" name="category" data-vv-name="category"></v-select>
                    </v-flex>
                    <v-flex xs12 text-xs-center>
                    <div class="py-4"></div>
                    <button type="submit" name="submit-1">
                        <img src="/images/icons/start.png" width="72">
                    </button>
                    <br>
                    <span>Empezar</span>
                    <br>
                    <!--<v-btn color="warning" @click="step = --step">atras</v-btn>-->
                    </v-flex>
                </v-layout>
            </v-flex>
          </v-layout>
        </form>
      </v-container>
    </v-content>
    <v-toolbar app clipped-left fixed height="58" class="header-app white--text elevation-1">
      <v-toolbar-title>Iniciar jornada</v-toolbar-title>
      <v-dialog v-model="isLogout" max-width="290">
        <v-card>
          <v-card-title class="headline">Salir</v-card-title>

          <v-card-text>
            ¿Estás seguro que salir?
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
    <v-footer class="pa-3">
      <div style="width: 100%" class="text-xs-center"> <span @click.stop="isLogout = true"> Cerrar Sesion </span></div>
    </v-footer>
  </v-app>
</template>

<script>
import { axiosInstance } from '@/_plugins/axios.plugin'

const axios = axiosInstance

export default {
  async created() {
    await this.$store.dispatch('categories/getAll')

    if (this.categories.length) {
      this.category_id = this.categories[0].id
    }
  },
  data: () => ({
    isLogout: false,
    category_id: null,
  }),
  computed: {
    categories() { return this.$store.state.categories.list },
    authUser() { return this.$store.state.auth.authUser }
  },
  methods: {
    setCategory(val) {
      this.category_id = val
    },
    async handleLoginSubmit() {
        const loginData = { category_id: this.category_id }
        axios.post('start-work', loginData)
          .then(res => {
            localStorage.setItem('coho_work', JSON.stringify(res.data.data))
            this.$router.push('/work')
          }, error => {
            alert('Datos incorrectos por favor verifique!')
            console.log(error)
          })
    },
    logout() {
      this.$store.dispatch('auth/logout').then((result) => {
        this.$router.push('/login')
      })
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>