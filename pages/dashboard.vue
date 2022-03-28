<template>
  <div>
    <!-- <pre>{{ lists }}</pre> -->
    <v-row class="mt-5">
      <v-col cols="10" v-for="(item, i) in lists" :key="i">
        <v-card class="mx-auto" max-width="400" outlined>
          <v-list-item three-line style="background: wheat">
            <v-list-item-content>
              <h2 style="color: crimson">สถานการณ์ผู้ติดเชื้อไวรัส covid19</h2>
              <div class="text-overline mb-4">
                <v-btn text color="primary accent-5">
                  ของวันที่ : {{ item.txn_date }}
                </v-btn>
              </div>
              <div class="text-overline mb-4">
                จำนานผู้ป่วยใหม่ : {{ Number(item.new_case).toLocaleString() }}
              </div>
              <div class="text-overline mb-4">
                จำนวนผู้ป่วยทั้งหมด :
                {{ Number(item.total_case).toLocaleString() }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="10" v-for="(item, i) in lists" :key="i">
        <v-card class="mx-auto" max-width="400" outlined>
          <v-list-item three-line style="background: skyblue">
            <v-list-item-content style="color: firebrick">
              <h2 style="color: green">จำนวนผู้หายป่วย covid19</h2>
              <div class="text-overline mb-4">
                <v-btn text color="primary accent-5">
                  ของวันที่ :{{ item.txn_date }}
                </v-btn>
              </div>
              <div class="text-overline mb-4">
                ผู้ป่วยที่หายป่วย :
                {{ Number(item.new_recovered).toLocaleString() }}
              </div>
              <div class="text-overline mb-4">
                จำนวนผู้หายป่วยทั้งหมด :
                {{ Number(item.total_recovered).toLocaleString() }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="10" v-for="(item, i) in lists" :key="i">
        <v-card class="mx-auto" max-width="400" outlined>
          <v-list-item three-line style="background: pink">
            <v-list-item-content style="color: black">
              <h2 style="color: black">จำนวนผู้เสียชีวิต covid19</h2>
              <div class="text-overline mb-4">
                <v-btn text color="primary accent-5">
                  ของวันที่ : {{ item.txn_date }}
                </v-btn>
              </div>
              <div class="text-overline mb-4">
                ผู้เสียชีวิต : {{ Number(item.new_death).toLocaleString() }}
              </div>
              <div class="text-overline mb-4">
                จำนวนผู้เสียชีวิตทั้งหมด :
                {{ Number(item.total_death).toLocaleString() }}
              </div>
              <!-- {{ Number(num).toLocaleString() }} -->
            </v-list-item-content>
          </v-list-item>
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
      const result = await this.$axios.$get(
        'https://covid19.ddc.moph.go.th/api/Cases/today-cases-all'
      )
      this.lists = result
    },
  },
}
</script>
<style>
element.style {
  color: brown;
}
</style>
