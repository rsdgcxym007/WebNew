<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>
          รายการคำร้องขอ
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="ค้นหา"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="details"
          :items-per-page="5"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:[`item.status_name`]="{ item }">
            <v-chip :color="item.color">
              {{ item.status_name }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ['headers', 'details'],
  data() {
    return {
      search: '',
    }
  },
  methods: {},
}
</script>
