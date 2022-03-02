<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>
          ผู้ป่วยที่ขอความช่วยเหลือ
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
          <template v-slot:[`item.actions`]="{ item }">
            <!-- <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon> -->
            <v-btn color="success" @click="helper(item)">ช่วยเหลือ</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      headers: [],
      details: [],
    }
  },
  async fetch() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const { result: tasks, headers } = await this.$axios.$post(
        '/api/manage/taskallhelp'
      )
      this.details = tasks
      this.headers = headers
    },
    async helper(item) {
      const id = item.id
      const { result, message } = await this.$axios.$post(
        '/api/manage/updatestatus',
        { id }
      )

      await this.fetchData()
      console.log('result : ', result)

      if (!result) {
        this.$swal({
          type: 'warning',
          title: message,
        })
      } else {
        this.$swal({
          type: 'success',
          title: message,
        })
      }
    },
  },
}
</script>
