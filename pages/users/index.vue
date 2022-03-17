<template>
  <div>
    <v-card elevation="8" width="auto" class="mx-16 my-6 pa-16">
      <v-card-title>ข้อมูลส่วนตัว </v-card-title>
      <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.email"
                label="E-mail"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.first_name"
                :counter="20"
                :rules="FnameRules"
                label="ชื่อ"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.last_name"
                :counter="20"
                :rules="LnameRules"
                label="นามสกุล"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="users.address"
                :rules="addressRules"
                label="ที่อยู่"
                outlined
                required
              ></v-textarea>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.tel"
                :rules="TelRules"
                label="โทรศัพท์"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="text-align: end">
              <v-btn color="error" class="mr-4" @click="fetchData">
                ล้างข้อมูล
              </v-btn>
              <v-btn :disabled="!valid" color="success" @click="updatedata">
                บันทึกข้อมูล
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      users: { first_name: '', last_name: '', email: '', tel: '', address: '' },
      valid: true,
      FnameRules: [
        (v) => !!v || 'กรุณากรอก ชื่อ',
        (v) => (v && v.length <= 20) || 'กรุณากรอกชื่อไม่เกิน 20 ตัวอักษร',
      ],
      LnameRules: [
        (v) => !!v || 'กรุณากรอก นามสกุล',
        (v) => (v && v.length <= 20) || 'กรุณากรอกนามสกุลไม่เกิน 20 ตัวอักษร',
      ],
      emailRules: [
        (v) => !!v || 'กรุณากรอก Email',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      addressRules: [(v) => !!v || 'กรุณากรอกที่อยู่'],
      TelRules: [
        (v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์',
        (v) => /^\d{10}$/.test(v) || 'เบอร์โทรไม่ถูกต้อง',
      ],
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      // const { result: tasks, headers } = await this.$axios.$post(
      //   '/api/manage/taskallbyuserid',
      //   { userId: this.$auth.user.id }
      // )
      // console.log(tasks)
      // this.test_task = tasks
      console.log('User ID : ' + this.$auth.user.id)
      const { result } = await this.$axios.$post('/api/user/getbyID', {
        id: this.$auth.user.id,
      })
      this.users = result
      console.log(this.users)
    },
    async updatedata() {
      this.$refs.form.validate()
      if (this.$refs.form.validate() === true) {
        const { result, message } = await this.$axios.$post(
          '/api/user/update',
          this.users
        )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
          })
        }
      } this.$router.go() //refresh page
    },
  },
}
</script>

<style>
@media only screen and (max-width: 600px) {
  v-card.cardRespond {
    padding: 2px;
    margin-left: 10px;
  }
}
</style>