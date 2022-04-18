<template>
  <v-container id="dropdown-example-2">
    <!-- <pre>{{requests}}</pre> -->
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title> อัพเดทอาการปัจจุบัน </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <br />
        <h2 align="center">อัพเดทสถานะผู้ป่วย</h2>
        <br />
        <v-text-field v-model="name" dense filled label="ชื่อผู้ป่วย" disabled>
        </v-text-field>
        <v-select
          v-model="status"
          item-text="text"
          item-value="id"
          class="my-2"
          :items="dropdown_icon"
          label="เลือกสถานะ"
          segmented
          target="#dropdown-example-2"
        ></v-select>
        <br />
        <div v-if="status === '95757608-7aec-426b-a4eb-286e1e44ecdd'">
          <v-select
            v-model="level"
            class="my-2"
            :items="dropdown_icon1"
            label="เลือกระดับอาการ"
            segmented
            target="#dropdown-example-3"
          ></v-select>
          <br />
        </div>

        <v-btn class="mr-2" color="success" @click="updatestatus()"
          >ยืนยัน</v-btn
        >
        <v-btn color="error" @click="black"> ย้อนกลับ</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      level: '',
      name: '',
      request: '',
      status: '',
      task: '',
      colorsymptom: '',
      tasks: [],
      menu: false,
      valid: true,
      user_id: this.$auth.user.id,
      requests: [],
      status_id: 'เขียว' || 'เหลือง' || 'แดง',
      dropdown_icon: [
        { text: 'ดำเนินเสร็จสิ้น', id: '95757608-7aec-426b-a4eb-286e1e44ecdd' },
        {
          text: 'ยกเลิก',
          id: '700d6270-2eb6-4acb-b9a4-426909fd343f',
        },
      ],
      dropdown_icon1: [
        { text: 'เขียว' },

        {
          text: 'เหลือง',
        },
        {
          text: 'แดง',
        },
      ],
    }
  },
  async fetch() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const { result, tasks } = await this.$axios.$post(
        // '/api/tasksvolunteen/getbyIduser',
        {
          id: this.$route.query.id,
        }
      )
      console.log(result)
      this.name = result.name
      // if (tasks.length > 0) {
      //   this.requests = tasks.map((x) => {
      //     if (x.status_name === 'กำลังช่วยเหลือ') {
      //       return x.name + ' (' + x.remark + ')'
      //     }
      //   })
      // }
      console.log(this.request)
    },
    async updatestatus() {
      console.log('stuatus', this.status)
      const { result, message } = await this.$axios.$post('/api/task/update', {
        id: this.$route.query.id,
        status_id: this.status,
        level: this.level,
      })
      if (!result) {
        console.log('error : ', message)
      } else {
        this.$swal({
          type: 'success',
          title: message,
        })
        this.$router.push({ path: '/volunteen/takecareuser' })
      }
    },
    black() {
      this.$router.push({ path: '/volunteen/takecareuser' })
    },
  },
}
</script>
