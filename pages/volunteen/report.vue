<template>
  <div>
    <!-- <pre>{{ this.$auth.user }}</pre> -->
    <v-container>
      <v-card>
        <v-card-title>
          คำร้องขอผู้ป่วยที่ทำเรื่องหายป่วย
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
          @click:row="editItem"
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
  middleware: 'auth',
  data() {
    return {
      search: '',
      headers: [],
      details: [],
    }
  },
  async fetch() {
    if (this.$auth.user.group_id != this.$constants.DATA.VOLUNTEER_GROUP) {
      this.$router.push('/')
    }
    await this.fetchData()
  },
  methods: {
    editItem(data) {
      this.$router.push('/volunteen/manageTask?id=' + data.id)
    },

    async fetchData() {
      const { result: tasks, headers } = await this.$axios.$post(
        '/api/manage/report'
      )
      this.details = tasks
      this.headers = headers
    },
    async helper(item) {
      const id = item.id
      const { result, message } = await this.$axios.$post(
        '/api/volunteen/updatestatususerhelp',
        { id, user_id_va: this.$auth.user.id }
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
