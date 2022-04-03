<template>
  <div>
    <!-- <pre>{{ this.$auth.user }}</pre> -->
    <v-container>
      <v-card>
        <v-card-title>
          รายชื่ออาสาทั้งหมด
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
          <!-- <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="success" @click="helper(item)">ช่วยเหลือ</v-btn>
          </template> -->
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return { details: [], headers: [], search: '' }
  },
  methods: {
    async fetchData() {
      const { result: users, headers } = await this.$axios.$post(
        '/api/admin/allvolunteen'
        // { userId: this.$auth.user.group_id }
      )
      console.log('users', users)
      this.details = users
      this.headers = headers
    },
  },
}
</script>
