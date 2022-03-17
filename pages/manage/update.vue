<template>
  <v-container>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        อัพเดทอาการปัจจุบัน
        <v-spacer></v-spacer>
      </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation class="px-4">
        <v-textarea
          v-model="taskData.remark"
          counter
          label="อัพเดทอาการปัจจุบัน"
          outlined
          required
        ></v-textarea>
        <v-col cols="12" class="px-0" style="text-align: end">
          <v-btn class="mr-2" color="success" @click="request()">ยืนยัน</v-btn>
          <v-btn color="error" @click="black"> ย้อนกลับ</v-btn>
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return {
      valid: '',
      remarkRules: [(v) => !!v || 'is required'],
      // body: {
      //   remark: '',
      //   user_id: this.$auth.user.id,
      //   // status_id: 'กำลังช่วยเหลือ',
      // },
      taskData: {
        remark: '',
        id: ''
      },
    }
  },
  methods: {
    async fetchData() {
      const { result: tasks } = await this.$axios.$post(
        '/api/tasks/getbyId',
        { id: this.$route.query.id }
      )
      this.taskData = tasks
    },
    async request() {
      this.$refs.form.validate()
      if (this.$refs.form.validate() === true) {
        const { result, message } = await this.$axios.$post(
          '/api/manage/update',
          this.taskData
        )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
          })
          this.$router.push({ path: '/manage' })
        }
      }
    },
    black() {
      this.$router.push({ path: '/manage' })
    },
  },
}
</script>
