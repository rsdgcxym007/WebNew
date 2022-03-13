<template>
  <div>
    <v-container>
      <v-card elevation="8" class="mx-4 pa-4">
        <v-card-title>
          ขอความช่วยเหลือ
          <v-spacer></v-spacer>
        </v-card-title>
        <v-form ref="form1" lazy-validation class="px-4">
          <v-row>
            <v-col cols="12" sm="6" md="12">
              <v-autocomplete
                v-model="body.type"
                :items="types"
                dense
                filled
                outlined
                label="ประเภท"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="body.remark"
                label="คำอธิบายอาการเบื้องต้น"
                outlined
                required
              ></v-textarea>
            </v-col>
            <v-col cols="12" style="text-align: end">
              <v-btn color="success" @click="request()">Request</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      types: [],
      // remarkRules: [(v) => !!v || 'Password is required'],

      body: {
        type: 'ป่วย',
        remark: '',
        user_id: this.$auth.user.id,
        // user_id: 1,
        status_id: 'ขอความช่วยเหลือ',
      },
    }
  },
  async fetch() {
    if (this.$auth.user.group_id != '51b0e763-1f09-416a-afa9-d2f0ce78e9e6') {
      this.$router.push('/')
    }
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const { result: types } = await this.$axios.$get('/api/master/type')

      this.types = types
    },
    async request() {
      this.$refs.form1.validate()
      if (this.$refs.form1.validate() === true) {
        const { result, message } = await this.$axios.$post(
          '/api/manage/request',
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
  },
}
</script>
