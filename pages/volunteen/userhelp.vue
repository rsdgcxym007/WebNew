<template>
  <div>
    <!-- <pre>{{ this.$auth.user }}</pre> -->
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
          @click:row="editItem"
        >
          <template v-slot:[`item.status_name`]="{ item }">
            <v-chip :color="item.color" dark>
              {{ item.status_name }}
            </v-chip>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            <div>
              {{ moment(item.created_at) }}
            </div>
          </template>
          <template v-slot:[`item.address_from_gmap`]="{ item }">
            <div class="a">{{ item.address_from_gmap }}.</div>
          </template>
          <template v-slot:[`item.remark`]="{ item }">
            <div class="a">{{ item.remark }}.</div>
          </template>
          <template v-slot:[`item.level`]="{ item }">
            <v-chip :color="item.level" dark>
              <div v-if="item.level == 'green'">เขียว</div>
              <div v-if="item.level == 'yellow'">เหลือง</div>
              <div v-if="item.level == 'red'">แดง</div>
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
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022'
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
    async fetchData() {
      const { result: tasks, headers } = await this.$axios.$post(
        // '/api/volunteen/taskallhelp'
        '/api/tasks/getAskForHelp'
      )
      this.details = tasks
      this.headers = headers
      // console.log('details : ', this.details)
      // console.log('header: ', this.headers)
    },

    moment(date) {
      return moment(date).add('543', 'year').format('DD/MM/YYYY,hh:mm a')
    },

    // async helper(item) {
    //   const id = item.id
    //   const { result, message } = await this.$axios.$post(
    //     '/api/volunteen/updatestatususerhelp',
    //     { id, user_id_va: this.$auth.user.id }
    //   )

    //   await this.fetchData()
    //   console.log('result : ', result)

    //   if (!result) {
    //     this.$swal({
    //       type: 'warning',
    //       title: message,
    //     })
    //   } else {
    //     this.$swal({
    //       type: 'success',
    //       title: message,
    //     })
    //   }
    // },
    editItem(data) {
      this.$router.push('/task/managetaskAll?id=' + data.id)
    },
  },
}
</script>
<style scoped>
div.a {
  white-space: nowrap;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

div.a:hover {
  overflow: visible;
}
</style>
