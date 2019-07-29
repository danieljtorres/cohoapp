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
            <v-btn color="blue darken-1" flat @click="isNewRecord = false">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click="saveRecord">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <v-btn color="primary" dark class="mb-2" @click="isNewRecord = true">Nuevo registro</v-btn>
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
            <tr>
              <th class="column text-xs-left">Fecha</th>
              <th class="column text-xs-left">Categoria</th>
              <th class="column text-xs-left">Actividad</th>
              <th class="column text-xs-left">Dia</th>
              <th class="column text-xs-left">Noche</th>
              <th class="column text-xs-left">Total Hrs</th>
              <th class="column text-xs-left">Total OF</th>
              <th class="column text-xs-left">Horas Compensables</th>
              <th class="column text-xs-left"></th>
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
                <td class="text-xs-center">{{record.schedule == 'day' ? getHours(record.start, record.end) : ''}}</td>
                <td class="text-xs-center">{{record.schedule == 'night' ? getHours(record.start, record.end) : ''}}</td>
                <td class="text-xs-center">
                  <v-chip outline color="secondary">{{getHours(record.start, record.end)}}</v-chip>
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
                            @click="setUserForEdit(props.item)"
                          >
                            edit
                          </v-icon>
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-title>
                          <v-icon
                            small
                            @click="setUserForDelete(props.item)"
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
export default {
  async created() {
    this.setFilters()
    await this.$store.dispatch('users/getEmployeeReport', this.params)
  },
  data: () => ({
    isNewRecord: false,
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
    saveRecord() {

    },
    saveToExcel() {

    },
    getHours(start, end) {
      const startMoment = this.$moment.unix(start)
      const endMoment = this.$moment.unix(end)

      return Math.round(endMoment.diff(startMoment, 'hours', true) * 100) / 100
    }
  },
  filters: {
    formatDate: function(value, moment, format) {
      return moment.unix(value).format(format)
    }
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

/*
<tr v-for="(record) in report" :key="record.id">
  <td>{{ record.workingDay.start | formatDate($moment, 'MM/DD/YYYY') }}</td>
  <td>{{ record.workingDay.category.name }}</td>
  <td>{{ record.activity.name }}</td>
  <td></td>
  <td></td>
  <td><v-chip outline color="secondary">{{ getHours(record.start, record.end) }}</v-chip></td>
</tr>
    
*/