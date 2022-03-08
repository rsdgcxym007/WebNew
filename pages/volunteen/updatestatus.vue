<template>
  <v-container class="my-16" id="dropdown-example-2" fluid>
    <v-row align="center" justify="center">
      <v-col cols="20" sm="20" md="10" lg="5">
        <v-row align="center"> </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <br />
          <h2 align="center">อัพเดทสถานะผู้ป่วย</h2>
          <br />
          <v-autocomplete
            v-model="task"
            :items="tasks"
            dense
            filled
            label="คำร้องขอ"
          ></v-autocomplete>
          <v-overflow-btn
            class="my-2"
            :items="dropdown_icon"
            label="เลือกสถานะ"
            segmented
            target="#dropdown-example-2"
          ></v-overflow-btn>
          <br />
          <v-overflow-btn
            class="my-2"
            :items="dropdown_icon1"
            label="เลือกระดับอาการ"
            segmented
            target="#dropdown-example-3"
          ></v-overflow-btn>
          <br />
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      task: '',
      tasks: [],
      menu: false,
      valid: true,
      user_id: this.$auth.user.id,
    }
  },
  async fetch() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const { result: tasks } = await this.$axios.$post(
        '/api/volunteen/getbyuser',
        { user_id: this.user_id }
      )

      this.tasks = tasks
    },
  },
  data: () => ({
    dropdown_icon: [
      { text: 'ขอความช่วยเหลือ', callback: () => console.log('helpme') },
      {
        text: 'กำลังช่วยเหลือ',
        callback: () => console.log('varbel'),
      },
      { text: 'ช่วยเหลือแล้ว', callback: () => console.log('fist') },
      {
        text: 'ยกเลิก(ข้อมูลไม่ถูกต้อง,ซ้ำซ้อน)',
        callback: () => console.log('cleancel'),
      },
      { text: 'ปิดเคส(กรณีหายป่วย)', callback: () => console.log('close') },
    ],
    dropdown_icon1: [
      { text: 'เขียว', callback: () => console.log('green') },
      {
        text: 'เหลือง',
        callback: () => console.log('yellow'),
      },
      {
        text: 'แดง',
        callback: () => console.log('red'),
      },
    ],
  }),
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>
