<template>
  <v-container id="dropdown-example-2">
    <!-- <pre>{{requests}}</pre> -->
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title> อัพเดทอาการปัจจุบัน </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <br />
        <h2 align="center">อัพเดทสถานะผู้ป่วย</h2>
        <br />
        <v-select
          v-model="request"
          :items="requests"
          dense
          filled
          label="คำร้องขอ"
        ></v-select>
        <v-select
          v-model="status"
          class="my-2"
          :items="dropdown_icon"
          label="เลือกสถานะ"
          segmented
          target="#dropdown-example-2"
        ></v-select>
        <br />
        <div v-if="status === 'ดำเนินเสร็จสิ้น'">
          <v-select
            class="my-2"
            :items="dropdown_icon1"
            label="เลือกระดับอาการ"
            segmented
            target="#dropdown-example-3"
          ></v-select>
          <br />
        </div>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
        >
          บันทึกข้อมูล
        </v-btn>
        <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      request: '',
      status: '',
      task: '',
      tasks: [],
      menu: false,
      valid: true,
      user_id: this.$auth.user.id,
      requests: [],
      dropdown_icon: [
        { text: 'ดำเนินเสร็จสิ้น' },
        {
          text: 'ยกเลิก',
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
      const { result: tasks } = await this.$axios.$post(
        '/api/volunteen/takecareuser',
        { userId: this.$auth.user.id }
      )
      if (tasks.length > 0) {
        this.requests = tasks.map(x => {
          if(x.status_name === 'กำลังช่วยเหลือ') {
            return x.name + " (" + x.remark + ")"
          }
        })
      }
    },
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>
