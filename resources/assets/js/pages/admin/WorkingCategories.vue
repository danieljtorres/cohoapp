<template>
  <v-content>
    <v-container fluid>
      <v-dialog :value="isAction" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isAction == 'edit' ? 'Editar' : 'Nueva' }} categoria</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md4>
                  <v-text-field v-model="cat.name" label="Nombre"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="text-xs-center">
                  <v-text-field type="number" v-model="cat.compute" label="Computa"></v-text-field>
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
      <v-card>
        <v-card-title>
          <v-btn color="primary" dark class="mb-2" @click="isAction = 'save'">Nuevo categoria</v-btn>
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
          :headers="headersForCategories"
          :items="categories"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.compute }}</td>
            <td class="text-xs-center">
              <v-icon
                small
                class="mr-2"
                @click="setActForEdit(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                small
                @click="setActForDelete(props.item)"
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
    await this.$store.dispatch('categories/getAll')
  },
  data: () => ({
    isAction: false,
    cat: {
      category_id: null,
      name: '',
      compute: 1
    },
    catForDelete: null,
    search: '',
    headersForCategories: [
      { text: '#', value: 'id' },
      { text: 'Nombre', value: 'name', align: 'left' },
      { text: 'Computa', value: 'compute', align: 'left' },
      { text: 'Acciones', value: 'name', align: 'left' },
    ]
  }),
  computed: {
    categories() { return this.$store.state.categories.list }
  },
  methods: {
    setActForEdit(item) {
      this.cat.category_id = item.id
      this.cat.name = item.name
      this.cat.compute = item.compute
      this.isAction = 'edit'
    },
    setActForDelete(item) {
      this.actForDelete = item.id
    },
    doAction() {
      const vue = this
      let catData, promise
      if (this.isAction == 'save') {
        catData = Object.assign({}, this.cat)
        delete catData.category_id
        promise = this.$store.dispatch('categories/save', catData)
      } else if (this.isAction == 'edit') {
        promise = this.$store.dispatch('categories/edit', this.cat)
      }

      promise.then((result) => {
        console.log(result)
        this.cat.category_id = null
        this.cat.name = ''
        this.cat.compute = 1
        vue.isAction = false
      }).catch((err) => {
        console.log(err)
      });
    }
  },
}
</script>