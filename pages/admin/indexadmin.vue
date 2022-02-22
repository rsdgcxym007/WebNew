<template>
  <v-container fluid class="pa-0">
    <v-row align="center">
      <v-col cols="12">
        <div class="my-16">
          <v-btn x-large color="success" dark @click="edituser"
            >ข้อมูลผู้ป่วย</v-btn
          >
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <div class="my-2">
          <v-btn x-large color="success" dark @click="editvolun"
            >ข้อมูลอาสา</v-btn
          >
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <div class="my-2">
          <v-btn x-large color="success" dark @click="banuser"
            >ผู้ใช้งานที่ถูกแบน</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    edituser() {
      this.$router.push({ path: '/admin/edituser' })
    },
    editvolun() {
      this.$router.push({ path: '/admin/editvolun' })
    },
    banuser() {
      this.$router.push({ path: '/admin/banuser' })
    },
    async logout() {
      await this.$auth.logout()
      this.$router.push('/')
    },
  },
}
</script>
