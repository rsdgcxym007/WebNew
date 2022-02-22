<template>
  <v-container class="my-16" fluid>
    <v-row align="center" justify="center">
      <v-col cols="20" sm="20" md="10" lg="5">
        <v-row align="center"> </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <br />
          <h2 align="center">อัพเดทอาการปัจจุบัน</h2>
          <br />
          <v-textarea
            v-model="body.remark"
            counter
            label="อัพเดทอาการปัจจุบัน"
            :rules="remarkRules"
            required
          ></v-textarea>
          <v-col cols="12">
            <v-btn color="success" @click="request()">Request</v-btn>
            <v-btn color="error" class="mr-4" @click="black"> ย้อนกลับ</v-btn>
          </v-col>
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
      valid: '',
      remarkRules: [(v) => !!v || 'is required'],
      body: {
        remark: '',
        user_id: this.$auth.user.id,
        // status_id: 'กำลังช่วยเหลือ',
      },
    }
  },
  methods: {
    async request() {
      this.$refs.form.validate()
      if (this.$refs.form.validate() === true) {
        const { result, message } = await this.$axios.$post(
          '/api/manage/update',
          this.body
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
