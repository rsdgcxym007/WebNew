<template>
  <div>
    <!-- <pre>{{ lists }}</pre> -->
    <v-row class="mt-5">
      <v-col cols="6" v-for="(item, i) in lists" :key="i">
        <v-card class="mx-auto" max-width="500" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                อาการ : {{ item.remark }} ({{ item.statusname }})
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ item.fullname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                ชื่อโรงพยาบาล : {{ item.hospital }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                วันที่และเวลา :
                {{ $moment(item.updated_at).format('DD MMM YYYY HH:mm:ss') }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="120">
              <v-img :src="item.image_medical"></v-img>
            </v-list-item-avatar>
          </v-list-item>
          <v-card-actions>
            <v-btn color="success" @click="helper(item)"
              >ยืนยันการหายป่วย</v-btn
            >
            <v-btn color="notsuccess" @click="nothelper(item)"
              >ยกเลิกการหายป่วย</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return { lists: [] }
  },
  methods: {
    async fetchData() {
      const { result } = await this.$axios.$get('/api/manage/report')
      this.lists = result
    },
    async helper(item) {
      const id = item.id
      const { result, message } = await this.$axios.$post(
        '/api/volunteen/updatereport',
        { id }
      )

      await this.fetchData()
      console.log('result : ', result)

      if (!result) {
        this.$swal({
          type: 'warning',
          title: message,
        })
      } else {
        this.$swal({
          type: 'success',
          title: message,
        })
        this.$router.push({ path: '/volunteen/userhelp' })
      }
    },
  },
}
</script>
