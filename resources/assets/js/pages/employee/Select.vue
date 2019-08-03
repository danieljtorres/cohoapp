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
    </v-toolbar>
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
    category_id: null,
  }),
  computed: {
    categories() { return this.$store.state.categories.list }
  },
  methods: {
    setCategory(val) {
      this.category_id = val
    },
    async handleLoginSubmit() {
        const loginData = { category_id: this.category_id }
        axios.post('start-work', loginData)
          .then(res => {
            res.data.data
            localStorage.setItem('coho_work', JSON.stringify(res.data.data))
            this.$router.push('/work')
          }, error => {
            alert('Datos incorrectos por favor verifique!')
            console.log(error)
          })
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>