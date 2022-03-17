<template>
  <div id="app">
    <v-app id="inspire">
      <v-main>
        <v-container class="fill-height area" fluid>
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="10" md="6" lg="4">
              <v-card class="elevation-12">
                <v-tabs v-model="tabs" fixed-tabs color="light-blue darken-4">
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab href="#mobile-tabs-5-1">
                    <h3>เข้าสู่ระบบ</h3>
                  </v-tab>

                  <v-tab href="#mobile-tabs-5-2"> <h3>ลงทะเบียน</h3> </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tabs">
                  <v-tab-item :value="'mobile-tabs-5-1'">
                    <v-card flat class="mb-4">
                      <v-card-text>
                        <v-form ref="form1" lazy-validation>
                          <v-text-field
                            v-model="email"
                            label="อีเมล"
                            prepend-icon="mdi-account"
                            type="text"
                            autocomplete="off"
                          ></v-text-field>

                          <v-text-field
                            id="password"
                            v-model="password"
                            label="รหัสผ่าน"
                            prepend-icon="mdi-lock"
                            autocomplete="off"
                            :type="show1 ? 'text' : 'password'"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <!-- <v-btn color="blue" @click="loginfacebook"
                          >login facebook</v-btn
                        > -->
                        <v-spacer></v-spacer>
                        <v-btn @click="reset1">ล้างข้อมูล</v-btn>
                        <v-btn color="primary" @click="onSubmit"
                          ><v-icon>mdi-lock</v-icon>เข้าสู่ระบบ</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item :value="'mobile-tabs-5-2'">
                    <v-card flat class="mb-4">
                      <v-card-text>
                        <v-form ref="form2" lazy-validation>
                          <v-text-field
                            v-model="first_name"
                            label="ชื่อ"
                            prepend-icon="mdi-account"
                            type="text"
                            :rules="first_nameRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="last_name"
                            label="นามสกุล"
                            prepend-icon="mdi-account"
                            type="text"
                            :rules="last_nameRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="address"
                            label="ที่อยู่"
                            prepend-icon="mdi-clipboard-account"
                            type="text"
                            :rules="addressRules"
                            required
                          ></v-text-field>

                          <v-text-field
                            v-model="tel"
                            label="เบอร์โทรศัพท์"
                            prepend-icon="mdi-phone"
                            type="text"
                            :rules="telRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="email"
                            label="อีเมล"
                            prepend-icon="mdi-account"
                            :rules="emailRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="password"
                            label="รหัสผ่าน"
                            prepend-icon="mdi-lock"
                            :rules="passwordRules"
                            required
                          ></v-text-field>
                          <v-col cols="12" sm="6" md="12">
                            <v-autocomplete
                              v-model="group"
                              :items="groups"
                              dense
                              filled
                              label="ประเภท"
                            ></v-autocomplete>
                          </v-col>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="reset2">ล้างข้อมูล</v-btn>
                        <v-btn color="primary" @click="validate2"
                          >ลงทะเบียน</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script>
export default {
  layout: 'emplty',
  //   middleware: 'logged',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return {
      group: 'ผู้ป่วย',
      groups: [],
      tabs: null,
      password: '123456789',
      first_name: 'aaa',
      last_name: 'aaa',
      address: 'aaaaa',
      tel: '0875554422',
      email: 'testuser1@dpu.ac.th',
      show1: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [(v) => !!v || 'Password is required'],
      first_nameRules: [(v) => !!v || 'Name is required'],
      last_nameRules: [(v) => !!v || 'last_name is required'],
      addressRules: [(v) => !!v || 'Position is required'],
      telRules: [(v) => !!v || 'Tel is required'],
    }
  },
  methods: {
    async fetchData() {
      const { result: groups } = await this.$axios.$get('/api/master/group')

      this.groups = groups
    },
    reset1() {
      this.$refs.form1.reset()
    },
    reset2() {
      this.$refs.form2.reset()
    },
    validate1() {
      if (this.$refs.form1.validate() === true) {
        this.onSubmit()
      } else {
        this.$swal({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          timer: 3000,
        })
      }
    },
    validate2() {
      if (this.$refs.form2.validate() === true) {
        this.register()
      } else {
        this.$swal({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          timer: 3000,
        })
      }
    },
    async onSubmit() {
      const { data } = await this.$auth.loginWith('local', {
        data: { email: this.email, password: this.password },
      })

      const { result, message } = data

      this.$swal.fire({
        type: result ? 'success' : 'warning',
        title: result ? 'เข้าสู่ระบบสำเร็จ' : 'เข้าสู่ระบบไม่สำเร็จ',
        text: result ? '' : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        confirmButtonText: 'ตกลง',
        // text: `${message}`,
      })
      if (this.$auth.user.group_id === '51b0e763-1f09-416a-afa9-d2f0ce78e9e6') {
        this.$router.push({ path: '/manage' })
      } else if (
        this.$auth.user.group_id === '87191711-d7ff-4664-b648-8e9bceaab5ea'
      ) {
        this.$router.push({ path: '/volunteen/userhelp' })
      } else if (
        this.$auth.user.group_id === '4e095238-1b60-4303-a207-8927d9c992d5'
      ) {
        this.$router.push({ path: '/admin/indexadmin' })
      }
    },
    async register() {
      const user = {
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        tel: this.tel,
        address: this.address,
        group: this.group,
      }

      const { result, message } = await this.$axios.$post(
        '/api/auth/register',
        user
      )

      this.$swal.fire({
        type: result ? 'success' : 'warning',
        title: 'register',
        text: `${message}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.area {
  background: #6200ea;
  background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
  width: 100%;
  height: 100vh;
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
}

.circles li:nth-child(1) {
  left: 25%;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.circles li:nth-child(2) {
  left: 10%;
  width: 20px;
  height: 20px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 20px;
  height: 20px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 25px;
  height: 25px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 15px;
  height: 15px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 11s;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
