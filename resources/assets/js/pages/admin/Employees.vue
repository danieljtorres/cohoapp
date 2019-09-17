<template>
  <v-content>
    <v-container fluid>
      <v-dialog :value="isAction" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isAction == 'edit' ? 'Editar' : 'Nuevo' }} empleado</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field type="email" v-model="user.username" label="Nombre de usuario"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="user.email" label="Correo"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="user.firstname" label="Nombre"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="user.lastname" label="Apellido"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="user.password" label="Contraseña"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="isAction = false">Cancelar</v-btn>
            <v-btn :loading="isSaving" color="blue darken-1" flat @click="doAction">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog :value="userForDel" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Eliminar empleado</span>
          </v-card-title>

          <v-card-text>
            Seguro quiere eliminar el usuario
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="userForDel = null">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click="doDelete">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <v-btn color="primary" dark class="mb-2" @click="isAction = 'save'">Nuevo empleado</v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar..."
            single-line
            hide-details
            class="pt-0"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headersForEmployees"
          :items="employees"
          class="elevation-1"
          :search="search"
          no-data-text="No se encontraron resultados"
          no-results-text="No se encontraron coincidencias"
        >
          <template v-slot:items="props">
            <td class="text-xs-center">{{ props.item.id }}</td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.firstname + ' ' + props.item.lastname }}</td>
            <td>{{ props.item.created_at }}</td>
            <td class="text-xs-center">
              <router-link :to="'/admin/empleados/' + props.item.id">
                <v-icon
                  small
                  class="mr-2"
                >
                  person
                </v-icon>
              </router-link>
              <v-icon
                small
                class="mr-2"
                @click="setUserForEdit(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                small
                class="mr-2"
                @click="setUserForDel(props.item)"
              >
                delete
              </v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
import { axiosInstance } from '@/_plugins/axios.plugin'

const axios = axiosInstance

export default {
  async created() {
    await this.$store.dispatch('users/getEmployees')
  },
  data: () => ({
    isAction: false,
    isSaving: false,
    user: {
      user_id: null,
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      password: ''
    },
    userForDel: null,
    search: '',
    headersForEmployees: [
      { text: '#', value: 'id', align: 'center' },
      { text: 'Nombre de usuario', value: 'username', align: 'left' },
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Nombres', value: 'firstname', align: 'left' },
      { text: 'Creado', value: 'created_at', align: 'left' },
      { text: 'Acciones', align: 'center', sortable: false }
    ]
  }),
  computed: {
    employees() { return this.$store.state.users.employees }
  },
  methods: {
    setUserForEdit(item) {
      this.user.user_id = item.id
      this.user.username = item.username
      this.user.email = item.email
      this.user.firstname = item.firstname
      this.user.lastname = item.lastname
      this.isAction = 'edit'
    },
    setUserForDel(item) {
      this.userForDel = item.id
    },
    doAction() {
      const vue = this
      let userData, promise
      if (this.isAction == 'save') {
        this.isSaving = true
        userData = Object.assign({}, this.user)
        delete userData.user_id
        promise = this.$store.dispatch('users/saveEmployee', userData)
      } else if (this.isAction == 'edit') {
        promise = this.$store.dispatch('users/edit', this.user)
      }

      promise
        .then((result) => {
          this.user = {
            user_id: null,
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            password: ''
          }
          vue.isAction = false
          this.isSaving = false
        })
        .catch((err) => {
          alert("Revise las siguientes condiciones:\n"+
                "· El correo no debe estar registrado anteriormente\n"+
                "· El usuario no debe estar registrado anteriormente\n"+
                "· La contraseña es obligatoria")
          this.isSaving = false
        });
    },
    doDelete() {
      axios.delete('users/'+this.userForDel).then(() => {
        this.userForDel = null
        this.$store.dispatch('users/getEmployees')
      })
    }
  }
}
</script>