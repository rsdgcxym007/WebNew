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
          <template v-slot:[`item.address_from_gmap`]="{ item }">
            <div class="a">{{ item.address_from_gmap }}.</div>
          </template>
          <template v-slot:[`item.id`]="{ item }">
            <div class="a">{{ item.id }}.</div>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="item.color">
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <!-- <v-switch color="warning" @click="ban(item)">ระงับการใช้งาน</v-switch> -->
            <v-switch
              :input-value="getStatus(item.status)"
              :label="item.status"
              @change="ban(item)"
            ></v-switch>
          </template>
          <template v-slot:[`item.actions1`]="{ item }">
            <v-btn color="success" @click="editItem(item)">ดูข้อมูล</v-btn>
          </template>
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
    return {
      details: [],
      headers: [],
      search: '',
      status: true,
    }
  },
  methods: {
    async fetchData() {
      const { result: users, headers } = await this.$axios.$post(
        '/api/user/getAllVA'
        // { userId: this.$auth.user.id }
      )
      console.log('edituser', users)
      this.details = users
      this.headers = headers
    },
    getStatus(value) {
      console.log(value)
      if (value == 'active') {
        return true
      } else {
        return false
      }
    },
    async ban(data) {
      console.log(data)
      console.log('status', this.status)
      let value = ''
      if (data.status == 'active') {
        value = 'inactive'
      } else {
        value = 'active'
      }
      //   this.status = 'inactive'
      const { result, message } = await this.$axios.$post('/api/admin/ban', {
        id: data.id,
        status: value,
      })
      if (!result) {
        console.log('error : ', message)
      } else {
        this.$swal({
          type: 'success',
          title: message,
        })
        await this.fetchData()
      }
    },
    editItem(data) {
      this.$router.push('/admin/editbanuser?id=' + data.id)
      // this.$router.push('/manage/update?id=' + data.id)
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
