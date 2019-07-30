<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-form @submit.prevent="handleLoginSubmit">
              <v-card class="elevation-1">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Inicio de Sesion</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-text-field v-model="username" v-validate="'required'" :error-messages="errors.collect('username')" label="Nombre de usuario" data-vv-name="username" required></v-text-field>
                  <v-text-field type="password" v-model="password" v-validate="'required'" :error-messages="errors.collect('password')" label="Contraseña" data-vv-name="password" required></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" type="submit">Ingresar</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    async handleLoginSubmit() {
      try {
        const valid = await this.$validator.validateAll()
        if (valid) {
          let loginData = { username: this.username, password: this.password }
          this.$store.dispatch('auth/loginAdmin', loginData)
            .then(res => {
              this.$router.push('/admin')
            }, err => {
              console.log(err)
            }) 
        }
      } catch (error) {
        console.log(error)  
      }
    }
  }
}
</script>