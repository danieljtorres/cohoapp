<template>
  <v-content>
    <v-container fluid>
      <v-dialog v-model="isNewRecord" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="isNewRecord = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Nuevo registro</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveRecord">Guardar</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <date-range-picker
                    ref="startPicker"
                    :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
                    :singleDatePicker="true"
                    :timePicker="true"
                    :timePicker24Hour="true"
                    :showWeekNumbers="false"
                    :showDropdowns="false"
                    :ranges="false"
                    :autoApply="true"
                    v-model="newRecord.start"
                    @update="setNewRecordEnd"
                  >
                      <div slot="input" slot-scope="picker" style="min-width: 350px;">
                        {{ picker.startDate }}
                      </div>
                  </date-range-picker>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <date-range-picker
                    ref="endPicker"
                    :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
                    :singleDatePicker="true"
                    :timePicker="true"
                    :timePicker24Hour="true"
                    :showWeekNumbers="false"
                    :showDropdowns="false"
                    :ranges="false"
                    :autoApply="true"
                    :minDate="newRecord.start.startDate"
                    v-model="newRecord.end"
                  >
                      <div slot="input" slot-scope="picker" style="min-width: 350px;">
                        {{ picker.startDate }}
                      </div>
                  </date-range-picker>
                </v-flex>
                <v-flex xs12 sm11 md11>
                  <v-select :items="categories" @input="setCategory" :value="newRecord.category_id" item-text="name" item-value="id" label="Categoria laboral" name="category" data-vv-name="category"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <h2>Actividades</h2>
                </v-flex>
                <!--<v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                </v-flex>-->
              </v-layout>
            </v-container>
          </v-card-text>

        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <!--<v-btn color="primary" dark class="mb-2" @click="isNewRecord = true">Nuevo registro</v-btn>-->
          <v-btn color="green" v-if="report.length" dark class="mb-2" @click="saveToExcel">Exportar</v-btn>
          <v-spacer></v-spacer>
          <v-select
            :items="optionsFilters"
            v-model="filter"
            item-text="label"
            item-value="value"
            label="Filtros"
            @change="setFilters"
          ></v-select>
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
                <td :rowspan="day.records.length > 1 ? day.records.length + 1 : ''">{{ day.start | formatDate($moment, 'MM/DD/YYYY') }}</td>
                <td :rowspan="day.records.length > 1 ? day.records.length + 1 : ''">{{ day.category.name }}</td>
              </tr>
              <tr v-for="record in day.records" :key="record.id+'r'">
                <td style="border-left: 1px solid rgba(0,0,0,.12);"> {{record.activity.name}} </td>
                <td class="text-xs-center">{{record.schedule == 'day' ? getHours(record.start, record.end, record.activity.compute) : ''}}</td>
                <td class="text-xs-center">{{record.schedule == 'night' ? getHours(record.start, record.end, record.activity.compute) : ''}}</td>
                <td class="text-xs-center">
                  <v-chip outline color="secondary">{{ getHours(record.start, record.end, record.activity.compute) }}</v-chip>
                </td>
                <td></td>
                <td></td>
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
                            @click="setRecordForEdit(props.item)"
                          >
                            edit
                          </v-icon>
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-title>
                          <v-icon
                            small
                            @click="setRecordForDelete(props.item)"
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
              <td></td>
              <td></td>
              <td></td>
              <td class="text-xs-center white--text">Total dia</td>
              <td class="text-xs-center white--text">Total noche</td>
              <td class="text-xs-center white--text">TOTAL</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr v-if="report.length">
              <td></td>
              <td></td>
              <td></td>
              <td class="text-xs-center">{{ getTotals('day') }}</td>
              <td class="text-xs-center">{{ getTotals('night') }}</td>
              <td class="text-xs-center">{{ getTotals() }}</td>
              <td></td>
              <td></td>
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
    </v-container>
  </v-content>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'
import moment from 'moment'
import { constants } from 'crypto';

const momentnow = moment()

export default {
  async created() {
    await this.$store.dispatch('categories/getAll')
    if (this.categories.length) {
      this.newRecord.category_id = this.categories[0].id
    }
    this.setFilters()
    await this.$store.dispatch('users/getEmployeeReport', this.params)
    this.newRecord.user_id = this.params.id
  },
  data: () => ({
    isNewRecord: false,
    newRecord: {
      start: { startDate: momentnow.format(), endDate: momentnow.format() },
      end: { startDate: momentnow.format(), endDate: momentnow.format() },
      category_id: null,
      user_id: null,
      recordsData: []
    },
    recordForEdit: {},
    startFilter: null,
    endFilter: null,
    customFilters: false,
    filter: 'week',
    optionsFilters: [
      { label: 'Semana actual', value: 'week' },
      { label: 'Mes actual', value: 'month' },
      { label: 'Año actual', value: 'year' },
      { label: 'Perzonalizado', value: 'custom' },
    ]
  }),
  computed: {
    report() { return this.$store.state.users.report },
    categories() { return this.$store.state.categories.list },
    params() { return { start_filter: this.startFilter, end_filter: this.endFilter, user_id: this.$route.params.id } }
  },
  methods: {
    setFilters() {
      switch (this.filter) {
        case 'week':
          this.startFilter = this.$moment().startOf('week').unix();
          this.endFilter = this.$moment().unix();
          this.customFilters = false
          break;
        case 'month':
          this.startFilter = this.$moment().startOf('month').unix();
          this.endFilter = this.$moment().unix();
          this.customFilters = false
          break;
        case 'year':
          this.startFilter = this.$moment().startOf('year').unix();
          this.endFilter = this.$moment().unix();
          this.customFilters = false
          break;
        case 'custom':
          this.customFilters = true
          break;
      }
      
      this.$store.dispatch('users/getEmployeeReport', this.params)
    },
    setCategory(val) {
      this.newRecord.category_id = val
    },
    setRecordForEdit(item) {
      this.recordForEdit = item
    },
    setRecordForDelete(item) {
      this.recordForDelete = item.id
    },
    saveRecord() {
      this.$store.dispatch('records/save', newRecord).then((result) => {
        this.isNewRecord = false
      }).catch((err) => {
        
      });
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
    getHours(start, end, compute) {
      const startMoment = this.$moment.unix(start)
      const endMoment = this.$moment.unix(end)

      return Math.round((endMoment.diff(startMoment, 'hours', true) * 100) * parseFloat(compute)) / 100
    },
    getTotals(type = null) {
      let total = 0
      for (const day of this.report) {
        for (const record of day.records) {
          if (type == record.schedule) total += this.getHours(record.start, record.end, record.activity.compute)
          if (type == null) total += this.getHours(record.start, record.end, record.activity.compute)
        }
      }
      return total
    },
    setNewRecordEnd(e) {
      this.newRecord.end.startDate = e.startDate
      this.newRecord.end.endDate = e.endDate
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
</style>