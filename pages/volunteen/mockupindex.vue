<template>
  <v-row justify="center my-16">
    <v-btn color="primary" dark @click.stop="dialog = true">
      ต่ำแหน่งผู้ป่วย
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h15"> ชื่อคนป่วย </v-card-title>
        <v-card-text class="font-weight-black"> รับแจ้งเมื่อ 11:14 21/08/64 </v-card-text>
        <v-card-text class="font-weight-black"> สถานะ : ขอความช่วยเหลือ </v-card-text>
        <v-card-text class="font-weight-black"> เบอร์โทร </v-card-text>
        <v-card-text class="font-weight-black"> ที่อยู่ปัจจุบัน </v-card-text>
        <v-card-text class="font-weight-black"> ช่องทางติดต่ออืนๆ </v-card-text>
        <v-card-text class="font-weight-black"> อาการเบื้องต้น </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            นำทาง
          </v-btn>

          <v-btn color="green darken-1" text @click="dialog = false">
            ช่วยเหลือ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
    }
  },
}
</script>
