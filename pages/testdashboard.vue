<template>
  <div>
    <!-- <pre>{{ lists }}</pre> -->
    <v-row class="mt-5">
      <v-col cols="4">
        <v-card class="mx-auto pa-3" color="warning" max-width="400">
          <div class="white--text text-center">ผู้ติดเชื้อสะสม</div>
          <div class="white--text text-center text-h5">
            {{ Number(lists.total_case).toLocaleString() }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="white--text text-center">
            เพิ่ม {{ Number(lists.new_case).toLocaleString() }} ราย
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto pa-3" color="success" max-width="400">
          <div class="white--text text-center">ผู้ติดเชื้อสะสม</div>
          <div class="white--text text-center text-h5">
            {{ Number(lists.total_case).toLocaleString() }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="white--text text-center">
            เพิ่ม {{ Number(lists.new_case).toLocaleString() }} ราย
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto pa-3"  color="error" max-width="400">
          <div class="white--text text-center">ผู้ติดเชื้อสะสม</div>
          <div class="white--text text-center text-h5">
            {{ Number(lists.total_case).toLocaleString() }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="white--text text-center">
            เพิ่ม {{ Number(lists.new_case).toLocaleString() }} ราย
          </div>
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
      this.lists = result[0]
      console.log(this.lists)
    },
  },
}
</script>
<style>
element.style {
  color: brown;
}
.card-color {
  background: #f12711; /* fallback for old browsers */
  background: linear-gradient(#f12711, #f5af19);
}
</style>
