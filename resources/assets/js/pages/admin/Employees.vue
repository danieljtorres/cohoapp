<template>
  <v-content>
    <v-container fluid>
      <v-dialog v-model="isNewUser" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Nuevo empleado</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <!--<v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                </v-flex>
              </v-layout>-->
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="isNewUser = false">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click="saveUser">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <v-btn color="primary" dark class="mb-2" @click="isNewUser = true">Nuevo empleado</v-btn>
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
                @click="setUserForDelete(props.item)"
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
export default {
  async created() {
    await this.$store.dispatch('users/getEmployees')
  },
  data: () => ({
    isNewUser: false,
    userForSave: {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      repassword: ''
    },
    userForEdit: null,
    userForDelete: null,
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
      this.userForEdit = item
    },
    setUserForDelete(item) {
      this.userForDelete = item
    },
    saveUser() {

    }
  }
}
</script>