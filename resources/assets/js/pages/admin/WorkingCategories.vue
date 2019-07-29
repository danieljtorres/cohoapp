<template>
  <v-content>
    <v-container fluid>
      <v-data-table
        :headers="headersForCategories"
        :items="categories"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.name }}</td>
        </template>
      </v-data-table>
    </v-container>
  </v-content>
</template>

<script>
export default {
  async created() {
    await this.$store.dispatch('categories/getAll')
  },
  data: () => ({
    headersForCategories: [
      { text: '#', value: 'id' },
      { text: 'Nombre', value: 'name', align: 'left' }
    ]
  }),
  computed: {
    categories() { return this.$store.state.categories.list }
  }
}
</script>