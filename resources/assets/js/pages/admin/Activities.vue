<template>
  <v-content>
    <v-container fluid>
      <v-data-table
        :headers="headersForActivities"
        :items="activities"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.name }}</td>
          <td>
            <img v-if="props.item.icon" :src="`/images/icons/${props.item.icon}.png`" alt="" width="40" class="mr-3">
          </td>
          <td>
            <v-switch v-model="props.item.icon"></v-switch>
          </td>
        </template>
      </v-data-table>
    </v-container>
  </v-content>
</template>

<script>
export default {
  async created() {
    await this.$store.dispatch('activities/getAll')
  },
  data: () => ({
    headersForActivities: [
      { text: '#', value: 'id' },
      { text: 'Nombre', value: 'name', align: 'left' },
      { text: 'Icono', value: 'icon', align: 'left', sortable: false },
      { text: 'Pregunta', value: 'quest', align: 'left', sortable: false }
    ]
  }),
  computed: {
    activities() { return this.$store.state.activities.list }
  }
}
</script>