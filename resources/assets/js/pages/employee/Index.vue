<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12 md4>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex v-for="{ id, name, icon } in activities" :key="id" xs12>
            <v-card @click="setActivityForStart({ id, name })" class="elevation-1">
              <v-card-title class="title pa-2">
                <img v-if="activeActivity == null || activeActivity.id !== id" :src="`/images/icons/${icon}.png`" alt="" width="40" class="mr-3"> 
                <img v-else :src="`/images/icons/${icon}-active.png`" alt="" width="40" class="mr-3"> 
                {{ name }}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!--<v-dialog v-model="isStartActivity" max-width="290" persistent>
        <v-card v-if="activityForStart">

          <v-card-text>
            ¿Estás seguro de comenzar la actividad?
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" flat="flat" @click="isStartActivity = null; activityForStart = false">
              Cancelar
            </v-btn>

            <v-btn color="green darken-1" flat="flat" @click="startActivity">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>-->

      <!--<v-dialog v-model="isEndActivity" max-width="290">
        <v-card v-if="activeActivity">
          <v-card-title class="headline">
            <img :src="`/images/icons/${activeActivity.icon}.png`" alt="" width="30" class="mr-3"> {{ activeActivity.name }}
          </v-card-title>

          <v-card-text>
            <form v-if="activeActivity.quest">
              <textarea
                class="outline"
                placeholder="Describe las tareas realizadas"
                ref="answerForEndActivity"
                v-validate="'required'"
                data-vv-name="quest"
              ></textarea>
              <span v-if="errors.has('quest')"><small>{{ errors.collect('quest')[0] }}</small></span>
            </form>
            <small v-if="activeActivity.quest">* Es necesario rellenar antes de finalizar tu jornada o cambiar el tipo de trabajo</small>
            <small v-if="!activeActivity.quest">Quieres terminar la tarea?</small>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" flat="flat" @click="isEndActivity = false">
              Cancelar
            </v-btn>

            <v-btn color="green darken-1" flat="flat" @click="endActivity">
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
  beforeCreate() {
    const wd = this.$store.$sv.authService.getWork()
    this.$store.commit('auth/SET_WORK', wd)
  },
  created() {
    this.$store.dispatch('activities/getAll')
    this.$store.dispatch('activities/getActive')
  },
  data: () => ({
    isStartActivity: false,
    isEndActivity: false,
    activityForStart: null
  }),
  computed: {
    activities() {
      let acts = this.$store.state.activities.list
      
      if(this.wd.category_id == 8 || this.wd.category_id == 9) {
        return acts.filter((v) => {
          return v.id == 2
        })
      }
      return acts
    },
    activeActivity() { return this.$store.state.activities.active },
    wd() { return this.$store.state.auth.workingDay }
    
  },
  methods: {
    setActivityForStart(data) {
      if (!this.activeActivity) {
        this.isStartActivity = true;
        this.activityForStart = data
        this.startActivity()
      } else {
        if (this.activeActivity.id != data.id) {
          this.isEndActivity = true
          this.activityForStart = data
          this.endActivity()
        }
      }
    },
    startActivity() {
      this.$store.dispatch('activities/start', { activity_id: this.activityForStart.id })
        .then(res => {
        this.isStartActivity = false
      })
    },
    async endActivity() {
      const valid = await this.$validator.validateAll()
      if (valid) {
        this.$store.dispatch('activities/end')
          .then(res => {
          this.isEndActivity = false
          if (this.activityForStart != null) {
            //this.isStartActivity = true
            this.startActivity()
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    border: 2px solid #989898;
    border-radius: 3px;;
    padding: 3px 5px;
  }

  .active-activity {
    border: 2px solid #1ca088 !important;
    color: #1ca088 !important;
  }
</style>
