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
                  <span>Accede con tus datos para iniciar tu jornada laboral</span>
                  <br>
                  <v-flex xs12 text-xs-center>
                    <v-text-field v-model="username" v-validate="'required'" :error-messages="errors.collect('username')" label="Nombre de usuario" data-vv-name="username" required></v-text-field>
                    <v-text-field type="password" v-model="password" v-validate="'required'" :error-messages="errors.collect('password')" label="Contraseña" data-vv-name="password" required></v-text-field>
                    <div class="mb-3"></div>
                    <v-btn color="primary" type="submit">acceder</v-btn>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </form>
      </v-container>
    </v-content>
    <v-toolbar app clipped-left fixed height="58" class="header-app white--text elevation-1">
      <v-toolbar-title>Iniciar jornada</v-toolbar-title>
    </v-toolbar>
    <v-footer class="pa-3">
      <div style="width: 100%" class="text-xs-center">{{ date }}</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  async created() {
    let date
    this.timer = setInterval(() => {
      date = this.$moment().format('dddd, D [de] MMMM YYYY, h:mm:ss a')
      this.date = date.charAt(0).toUpperCase() + date.slice(1);
    }, 500)
  },
  data: () => ({
    date: '',
    timer: null,
    username: '',
    password: ''
  }),
  methods: {
    async handleLoginSubmit() {
      const valid = await this.$validator.validateAll()
      if (valid) {
        const loginData = { username: this.username, password: this.password }
        this.$store.dispatch('auth/loginEmployee', loginData)
          .then(res => {
            this.$router.push('/')
          }, error => {
            alert('Datos incorrectos por favor verifique!')
            console.log(error)
          })
      }
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>