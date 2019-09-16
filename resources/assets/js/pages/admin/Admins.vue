<template>
  <v-content>
    <v-container fluid>
      <v-dialog :value="isAction" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isAction == 'edit' ? 'Editar' : 'Nuevo' }} administrador</span>
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
            <v-btn color="blue darken-1" flat @click="doAction">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog :value="userForDel" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Eliminar admin</span>
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
          <v-btn color="primary" dark class="mb-2" @click="isAction = 'save'">Nuevo administrador</v-btn>
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
          :headers="headersForAdmins"
          :items="admins"
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
              <v-icon v-if="authUser.role == 1 || props.item.role > 1"
                small
                class="mr-2"
                @click="setUserForEdit(props.item)"
              >
                edit
              </v-icon>
              <v-icon v-if="authUser.role == 1 || props.item.role > 1"
                small
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
    await this.$store.dispatch('users/getAdmins')
  },
  data: () => ({
    isAction: false,
    user: {
      user_id: null,
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      password: ''
    },
    userForEdit: null,
    userForDel: null,
    search: '',
    headersForAdmins: [
      { text: '#', value: 'id', align: 'center' },
      { text: 'Nombre de usuario', value: 'username', align: 'left' },
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Nombres', value: 'firstname', align: 'left' },
      { text: 'Creado', value: 'created_at', align: 'left' },
      { text: 'Acciones', align: 'center', sortable: false }
    ]
  }),
  computed: {
    admins() { return this.$store.state.users.admins },
    authUser() { return this.$store.state.auth.authUser }
  },
  methods: {
    setUserForEdit(item) {
      this.userForEdit = item
    },
    setUserForDel(item) {
      this.userForDel = item.id
    },
    doAction() {
      const vue = this
      let userData, promise
      if (this.isAction == 'save') {
        userData = Object.assign({}, this.user)
        delete userData.user_id
        promise = this.$store.dispatch('users/saveAdmin', userData)
      } else if (this.isAction == 'edit') {
        promise = this.$store.dispatch('users/edit', this.user)
      }

      promise.then((result) => {
        console.log(result)
        this.user = {
          user_id: null,
          username: '',
          email: '',
          firstname: '',
          lastname: '',
          password: ''
        }
        vue.isAction = false
      }).catch((err) => {
        console.log(err)
      });
    },
    doDelete() {
      axios.delete('users/'+this.userForDel).then(() => {
        this.userForDel = null
        this.$store.dispatch('users/getAdmins')
      })
    }
  }
}
</script>