<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <form @submit.prevent="handleLoginSubmit">
          <v-layout align-center justify-center fill-height>
            <v-flex xs10 md4>
              <div class="py-5"></div>
              <fieldset data-vv-scope="step-2" v-if="step === 2">
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
                    <v-btn color="warning" @click="step = --step">atras</v-btn>
                  </v-flex>
                </v-layout>
              </fieldset>
              <fieldset data-vv-scope="step-1" v-if="step === 1">
                <v-layout align-center justify-center row wrap fill-height>
                  <v-flex xs12 text-xs-center>
                    <span>Accede con tus datos para iniciar tu jornada laboral</span>
                    <br>
                    <v-flex xs12 text-xs-center>
                      <v-text-field v-model="username" v-validate="'required'" :error-messages="errors.collect('step-2.username')" label="Nombre de usuario" data-vv-name="username" required></v-text-field>
                      <v-text-field type="password" v-model="password" v-validate="'required'" :error-messages="errors.collect('step-2.password')" label="Contraseña" data-vv-name="password" required></v-text-field>
                      <div class="mb-3"></div>
                      <v-btn color="primary" type="submit">acceder</v-btn>
                      <!--<v-btn color="warning" @click="step = --step">atras</v-btn>-->
                    </v-flex>
                  </v-flex>
                </v-layout>
              </fieldset>
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
    await this.$store.dispatch('categories/getAll')

    let date
    this.timer = setInterval(() => {
      date = this.$moment().format('dddd, D [de] MMMM YYYY, h:mm:ss a')
      this.date = date.charAt(0).toUpperCase() + date.slice(1);
    }, 500)

    if (this.categories.length) {
      this.category_id = this.categories[0].id
    }
  },
  data: () => ({
    step: 1,
    timer: null,
    date: '',
    category_id: null,
    username: '',
    password: ''
  }),
  computed: {
    categories() { return this.$store.state.categories.list }
  },
  methods: {
    setCategory(val) {
      this.category_id = val
    },
    async handleLoginSubmit() {
      const valid = await this.$validator.validateAll(`step-${this.step}`)
      if (valid && this.step < 2) {
        this.step = ++this.step
      } else if (valid && this.step === 2) {
        const loginData = { username: this.username, password: this.password, category_id: this.category_id }
        this.$store.dispatch('auth/loginEmployee', loginData)
          .then(res => {
            this.$router.push('/')
          }, error => {
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