<template>
  <v-content>
    <v-container fluid>
      <v-dialog v-model="isNewRecord" width="500" transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="isNewRecord = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Nuevo registro</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-datetime-picker label="Seleccionar fecha inicio" format="YYYY-MM-DD HH:mm:ss" v-model="newRecord.start"></v-datetime-picker>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-datetime-picker label="Seleccionar fecha fin" format="YYYY-MM-DD HH:mm:ss" v-model="newRecord.end"></v-datetime-picker>
                </v-flex>
                <v-flex xs12 sm8 md8>
                  <v-select :items="categories" @input="setCategory" :value="newRecord.category_id" item-text="name" item-value="id" label="Categoria laboral" name="category" data-vv-name="category"></v-select>
                </v-flex>
                <v-flex xs12 sm4 md4>
                  <v-text-field v-model="newRecord.retributed_hours" type="number" label="Hrs retribuidas" min="1"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="isNewRecord = false">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click="saveRecord">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <v-btn color="primary" dark class="mb-2" @click="isNewRecord = true">Nuevo registro</v-btn>
          <v-btn color="green" v-if="report.length" dark class="mb-2" @click="saveToExcel">Exportar</v-btn>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md3>
              <v-select
                :items="optionsFilters"
                v-model="filter"
                item-text="label"
                item-value="value"
                label="Filtros"
                @change="setFilters"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm8 md3 v-show="filter == 'custom'">
              <v-datetime-picker label="Fecha Inicio" format="YYYY-MM-DD HH:mm:ss" v-model="customStartFilter"></v-datetime-picker>
            </v-flex>
            <v-flex xs12 sm8 md3 v-show="filter == 'custom'">
              <v-datetime-picker label="Fecha Fin" format="YYYY-MM-DD HH:mm:ss" v-model="customEndFilter"></v-datetime-picker>
            </v-flex>
            <v-flex xs12 sm8 md3 v-show="filter == 'custom'">
              <v-btn color="blue darken-1" flat @click="setFilters">Aplicar</v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>

        <table class="v-datatable v-table theme--light">
          <thead>
            <tr class="blue darken-3">
              <th class="column text-xs-left white--text">Fecha</th>
              <th class="column text-xs-left white--text">Categoria</th>
              <th class="column text-xs-left white--text">Actividad</th>
              <th class="column text-xs-left white--text">Dia</th>
              <th class="column text-xs-left white--text">Noche</th>
              <th class="column text-xs-left white--text">Total Hrs</th>
              <th class="column text-xs-left white--text">Total OF</th>
              <th class="column text-xs-left white--text">Horas Compensables</th>
              <th class="column text-xs-left white--text"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="day in report">
              <tr :key="day.id">
                <td :rowspan="day.records.length > 1 ? day.records.length + 1 : 2" class="td-hover" @click="openDayRecordDialog(day.id)">
                  {{ day.start | formatDate($moment, 'MM/DD/YYYY') }}
                </td>
                <td :rowspan="day.records.length > 1 ? day.records.length + 1 : 2">{{ day.category.name }}</td>
              </tr>
              <tr v-if="!day.records.length" :key="day.id+'na'">
                <td colspan="7" class="text-xs-center"> N/A </td>
              </tr>
              <tr v-for="record in day.records" :key="record.id+'r'">
                <td style="border-left: 1px solid rgba(0,0,0,.12);"> {{record.activity.name}} </td>
                <td class="text-xs-center">{{record.schedule == 'day' ? getHours(record.start, record.end) : ''}}</td>
                <td class="text-xs-center">{{record.schedule == 'night' ? getHours(record.start, record.end) : ''}}</td>
                <td class="text-xs-center">
                  <v-chip outline color="secondary">{{ getHours(record.start, record.end) }}</v-chip>
                </td>
                <td> {{ getHours(record.start, record.end, day.category.name, record.activity.name) }} </td>
                <td class="text-xs-center">{{ day.retributed_hours }}</td>
                <td class="text-xs-center">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">list</v-icon>
                    </template>
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-title>
                          <v-icon
                            small
                            @click="setRecordForEdit(record)"
                          >
                            editx
                          </v-icon>
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-title>
                          <v-icon
                            small
                            @click="setRecordForDelete(record.id)"
                          >
                            delete
                          </v-icon>
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
            </template>
            <tr v-if="report.length" class="blue darken-1">
              <td>TOTAL</td>
              <td></td>
              <td></td>
              <td class="text-xs-center">{{ getTotals('day') }}</td>
              <td class="text-xs-center">{{ getTotals('night') }}</td>
              <td class="text-xs-center">{{ getTotals() }}</td>
              <td class="text-xs-center">{{ getTotals('compute') }}</td>
              <td class="text-xs-center">{{ getTotals('retributed') }}</td>
              <td></td>
            </tr>
          </tbody>
          <tbody v-if="!report.length">
            <tr>
              <td colspan="9" class="text-xs-center py-4">No se encontraron resultados</td>
            </tr>
          </tbody>
        </table>
      </v-card>
      <v-dialog v-model="dateTimeDialog" width="500">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dayRecordAction == 'edit' ? 'Editar' : 'Nueva' }} Actividad</span>
          </v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-datetime-picker format="YYYY-MM-DD HH:mm:ss" label="Seleccionar Fecha Inicio" v-model="dayRecord.start"></v-datetime-picker>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-datetime-picker format="YYYY-MM-DD HH:mm:ss" label="Seleccionar Fecha Fin" v-model="dayRecord.end"></v-datetime-picker>
              </v-flex>
              <v-flex xs12>
                <v-select :items="activities" @input="setActivity" :value="dayRecord.activity_id" item-text="name" item-value="id" label="Actividades" name="category" data-vv-name="category"></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dateTimeDialog = false">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click="saveDayRecord">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-content>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'
import moment from 'moment'
import { constants } from 'crypto';
import { axiosInstance } from '@/_plugins/axios.plugin'

const axios = axiosInstance

const momentnow = moment()

export default {
  async created() {
    await this.$store.dispatch('activities/getAll')

    await this.$store.dispatch('categories/getAll')
    if (this.categories.length) {
      this.newRecord.category_id = this.categories[0].id
    }
    this.setFilters()
    await this.$store.dispatch('users/getEmployeeReport', this.params)
    this.newRecord.user_id = this.params.user_id
  },
  data: () => ({
    isNewRecord: false,
    dateTimeDialog: false,
    dayRecord: {
      id: null,
      working_day_id: null,
      activity_id: null, 
      start: null,
      end: null,
    },
    dayRecordAction: 'add',
    newRecord: {
      start: null,
      end: null,
      category_id: null,
      user_id: null,
      retributed_hours: null
    },
    recordForEdit: {},
    startFilter: null,
    endFilter: null,
    customFilters: false,
    customStartFilter: null,
    customEndFilter: null,
    filter: 'week',
    optionsFilters: [
      { label: 'Semana actual', value: 'week' },
      { label: 'Mes actual', value: 'month' },
      { label: 'Año actual', value: 'year' },
      { label: 'Personalizado', value: 'custom' },
    ]
  }),
  computed: {
    report() { return this.$store.state.users.report },
    categories() { return this.$store.state.categories.list },
    params() { return { start_filter: this.startFilter, end_filter: this.endFilter, user_id: this.$route.params.id } },
    activities() { return this.$store.state.activities.list }
  },
  methods: {
    setFilters() {
      switch (this.filter) {
        case 'week':
          this.startFilter = this.$moment().startOf('week').unix();
          this.endFilter = this.$moment().unix();

          this.customStartFilter = null
          this.customEndFilter = null
          this.customFilters = false
          break;
        case 'month':
          this.startFilter = this.$moment().startOf('month').unix();
          this.endFilter = this.$moment().unix();

          this.customStartFilter = null
          this.customEndFilter = null
          this.customFilters = false
          break;
        case 'year':
          this.startFilter = this.$moment().startOf('year').unix();
          this.endFilter = this.$moment().unix();

          this.customStartFilter = null
          this.customEndFilter = null
          this.customFilters = false
          break;
        case 'custom':
          this.startFilter = moment(this.customStartFilter).unix()
          this.endFilter = moment(this.customEndFilter).unix()

          this.customFilters = true
          break;
      }
      
      this.$store.dispatch('users/getEmployeeReport', this.params)
    },
    setCategory(val) {
      this.newRecord.category_id = val
    },
    setRecordForEdit(record) {
      this.dayRecord = {
        id: record.id,
        working_day_id: record.working_day_id,
        activity_id: record.activity_id, 
        start: record.start,
        end: record.end,
      }

      this.dayRecord.start = moment.unix(this.dayRecord.start).format('YYYY-MM-DD HH:mm:ss')
      this.dayRecord.end = moment.unix(this.dayRecord.end).format('YYYY-MM-DD HH:mm:ss')

      this.dayRecordAction = 'edit'
      this.dateTimeDialog = true
    },
    setRecordForDelete(record_id) {
      axios.delete(`/working-record/delete/${record_id}`)
        .then(() => {
          this.$store.dispatch('users/getEmployeeReport', this.params)
        })
    },
    setActivity(activity_id) {
      this.dayRecord.activity_id = activity_id
    },
    saveRecord() {
      const startDate = moment(this.newRecord.start)
      const endDate = moment(this.newRecord.end)


      if (endDate.isBefore(startDate)) {
        alert('La fecha final no debe ser menor a la fecha de inicio')
        this.newRecord.end = startDate.add(8, 'hour')
        return
      }

      axios.post('/working-day/save', this.newRecord)
        .then(() => {
          this.$store.dispatch('users/getEmployeeReport', this.params)

          this.isNewRecord = false
        })
        .catch(e => {
          this.isNewRecord = false

          console.log(e)
        })
      // this.$store.dispatch('records/save', newRecord).then((result) => {
      //   this.isNewRecord = false
      // }).catch((err) => {
      //   console.log(err)
      // })
    },
    editRecord() {
      this.$store.dispatch('records/edit', recordForEdit).then((result) => {
        this.isEditRecord = false
      }).catch((err) => {
        
      });
    },
    saveToExcel() {
      this.$store.dispatch('users/getEmployeeReportToExcel', this.params)
    },
    getHours(start, end, category = null, activity = null) {
      const startMoment = this.$moment.unix(start)
      const endMoment = this.$moment.unix(end)

      let total = endMoment.diff(startMoment, 'hours', true)

      if (category && activity) {
        if(category != 'Chofer' && activity == 'Conducción') total = 0
      }

      return Math.round(total)
    },
    getTotals(type = null) {
      let total = 0
      for (const day of this.report) {
        if (type == 'retributed') total += day.retributed_hours
        for (const record of day.records) {
          if (type == record.schedule) total += this.getHours(record.start, record.end)
          if (type == 'compute') {
            total += this.getHours(record.start, record.end, day.category.name, record.activity.name)
          }
          if (type == null) total += this.getHours(record.start, record.end)
        }
      }
      return total
    },
    setNewRecordEnd(e) {
      this.newRecord.end.startDate = e.startDate
      this.newRecord.end.endDate = e.endDate
    },
    openDayRecordDialog(day_id) {
      this.dayRecord.working_day_id = day_id

      this.dateTimeDialog = true
    },
    saveDayRecord() {
      const startDate = moment(this.dayRecord.start)
      const endDate = moment(this.dayRecord.end)


      if (endDate.isBefore(startDate)) {
        alert('La fecha final no debe ser menor a la fecha de inicio')
        this.dayRecord.end = startDate.add(8, 'hour')
        return
      }

      axios.post('/working-record/save', this.dayRecord)
        .then(response => {
          this.$store.dispatch('users/getEmployeeReport', this.params)
          this.dateTimeDialog = false

          this.dayRecord = {
            id: null,
            working_day_id: null,
            activity_id: null, 
            start: null,
            end: null,
          }
        })
        .catch(e => {
          this.dayRecord = {
            id: null,
            working_day_id: null,
            activity_id: null, 
            start: null,
            end: null,
          }

          this.dateTimeDialog = !this.dateTimeDialog
        })
    }
  },
  filters: {
    formatDate: function(value, moment, format) {
      return moment.unix(value).format(format)
    }
  },
  components: {
    DateRangePicker
  }
}
</script>

<style scoped>
  table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
    padding: 0 10px;
  }

  table.v-table tbody td, table.v-table tbody th {
    height: 32px;
  }

  table.v-table tbody td:not(:last-child) {
    padding: 0 24px;
    border-right: 1px solid rgba(0,0,0,.12);
  }
  table .td-hover{
    cursor: pointer;
  }
</style>