<template>
  <v-content>
    <v-container fluid>
      <v-dialog :value="isAction" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isAction == 'edit' ? 'Editar' : 'Nueva' }} actividad</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md4>
                  <v-text-field v-model="act.name" label="Nombre"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="text-xs-center">
                  <label for="Pregunta">Pregunta</label>
                  <v-switch class="mt-0" style="display: flex;justify-content: center;" v-model="act.quest"></v-switch>
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
          <v-btn color="primary" dark class="mb-2" @click="isAction = 'save'">Nuevo actividad</v-btn>
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
          :headers="headersForActivities"
          :items="activities"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>
              <label for="icon"><img :src="'/images/icons/' + props.item.icon"></label> 
              <input type="file" id="icon" ref="actIcon" @change="uploadFile(props.item.id)" style="visibility: hidden;">
            </td>
            <td>
              {{ props.item.quest ? 'SI' : 'NO' }}
            </td>
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
import { axiosInstance } from '@/_plugins/axios.plugin'

const axios = axiosInstance

export default {
  async created() {
    await this.$store.dispatch('activities/getAll')
  },
  data: () => ({
    isAction: false,
    act: {
      activity_id: null,
      name: '',
      quest: ''
    },
    actForDelete: null,
    search: '',
    headersForActivities: [
      { text: '#', value: 'id' },
      { text: 'Nombre', value: 'name', align: 'left' },
      { text: 'Icono', value: 'icon', align: 'left' },
      { text: 'Pregunta', value: 'quest', align: 'left', sortable: false },
      { text: 'Acciones', align: 'center', sortable: false }
    ]
  }),
  computed: {
    activities() { return this.$store.state.activities.list }
  },
  methods: {
    setActForEdit(item) {
      this.act.activity_id = item.id
      this.act.name = item.name
      this.act.quest = item.quest
      this.isAction = 'edit'
    },
    setActForDelete(item) {
      this.actForDelete = item.id
    },
    doAction() {
      const vue = this
      let catData, promise
      if (this.isAction == 'save') {
        catData = Object.assign({}, this.act)
        delete catData.activity_id
        promise = this.$store.dispatch('activities/save', catData)
      } else if (this.isAction == 'edit') {
        promise = this.$store.dispatch('activities/edit', this.act)
      }

      promise.then((result) => {
        console.log(result)
        vue.isAction = false
      }).catch((err) => {
        console.log(err)
      });
    },
    uploadFile(id) {
      const files = this.$refs.actIcon.files

      console.log(files[0])

      let formData = new FormData();
      formData.append('icon', files);
      formData.append('activity_id', id);
      axios.post('working-activities/icon', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }).then(function(){
        this.$store.dispatch('activities/getAll')
      })
      .catch(function(){
        console.log('FAILURE!!');
      });
    }
  }
}
</script>