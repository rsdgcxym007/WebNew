<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-main>
          <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
              <v-col cols="12" sm="10" md="6" lg="4">
                <v-card class="elevation-12">
                  <v-tabs v-model="tabs" fixed-tabs color="light-blue darken-4">
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab href="#mobile-tabs-5-1">
                      <h3>ขอความช่วยเหลือ</h3>
                    </v-tab>

                    <v-tab href="#mobile-tabs-5-2"> <h3>ลงทะเบียน</h3> </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tabs">
                    <v-tab-item :value="'mobile-tabs-5-1'">
                      <v-card flat>
                        <v-card-text>
                          <v-form ref="form1" lazy-validation>
                            <v-text-field
                              v-model="email"
                              label="email"
                              prepeFnd-icon="mdi-at"
                              type="text"
                              autocomplete="off"
                            ></v-text-field>

                            <v-text-field
                              id="password"
                              v-model="password"
                              label="password"
                              prepend-icon="mdi-lock"
                              autocomplete="off"
                              type="password"
                            ></v-text-field>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="blue" @click="loginfacebook"
                            >login facebook</v-btn
                          >
                          <v-spacer></v-spacer>
                          <v-btn @click="reset1">Reset</v-btn>
                          <v-btn color="primary" @click="onSubmit"
                            ><v-icon>mdi-lock</v-icon>เข้าสู่ระบบ</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item :value="'mobile-tabs-5-2'">
                      <v-card flat>
                        <v-card-text>
                          <v-form ref="form2" lazy-validation>
                            <v-text-field
                              v-model="first_name"
                              label="first_name"
                              prepend-icon="mdi-account"
                              type="text"
                            ></v-text-field>
                            <v-text-field
                              v-model="last_name"
                              label="last_name"
                              prepend-icon="mdi-account"
                              type="text"
                            ></v-text-field>
                            <v-text-field
                              v-model="address"
                              label="address"
                              prepend-icon="mdi-clipboard-account"
                              type="text"
                            ></v-text-field>

                            <v-text-field
                              v-model="tel"
                              label="tel"
                              prepend-icon="mdi-phone"
                              type="text"
                            ></v-text-field>
                            <v-text-field
                              v-model="email"
                              label="Email"
                            ></v-text-field>
                            <v-text-field
                              v-model="password"
                              label="Password"
                            ></v-text-field>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="reset2">Reset</v-btn>
                          <v-btn color="primary" @click="register"
                            >Register</v-btn
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
    </v-app>
  </div>
</template>
<script>
export default {
  layout: 'emplty',
  //   middleware: 'logged',
  data() {
    return {
      tabs: null,
      password: '12345678',
      first_name: 'aaaa',
      last_name: 'aaaa',
      address: 'aaaaa',
      tel: '09888888888',
      email: 'sssss@gmail.com',
    }
  },
  methods: {
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
        this.Register()
      } else {
        this.$swal({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          timer: 3000,
        })
      }
    },
    async loginfacebook() {
      await this.$auth.loginWith('facebook')
      this.$router.push({ path: '/user/profile' })
    },
    async onSubmit() {
      const { data } = await this.$auth.loginWith('local', {
        data: { email: this.email, password: this.password },
      })

      const { result, message, token } = data

      this.$swal.fire({
        type: result ? 'success' : 'warning',
        title: 'login',
        text: `${message}`,
      })

      await this.$auth.setUserToken(token)
      this.$router.push({ path: '/user/profile' })
    },
    async register() {
      const user = {
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        tel: this.tel,
        address: this.address,
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

<style></style>
