<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12 md4>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex v-for="{ id, name, icon, quest } in activities" :key="id" xs12>
            <v-card>
              <v-card-title class="title pa-2">
                <img :src="`/images/icons/${icon}.png`" alt="" width="40" class="mr-3"> {{ name }}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <!--<v-dialog v-model="selected" max-width="290">
        <v-card v-if="activity">
          <v-card-title class="headline">
            <img :src="`/images/icons/${icon}.png`" alt="" width="20"> {{ name }}
          </v-card-title>

          <v-textarea v-if="quest"
            outline
            name="quest"
            label="Describe las tareas realizadas"
          ></v-textarea>

          <v-card-text>
            <small>* Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</small>
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
      </v-dialog>-->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    activities() { return this.$store.state.activities.list }
  }
}
</script>