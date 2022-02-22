<template>
  <v-row justify="center my-16">
    <v-btn color="primary" dark @click.stop="dialog = true">
      ต่ำแหน่งผู้ป่วย
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h15"> ชื่อคนป่วย </v-card-title>
        <v-card-text class="font-weight-black">
          รับแจ้งเมื่อ 11:14 21/08/64
        </v-card-text>
        <v-card-text class="font-weight-black">
          สถานะ : ได้รับการช่วยเหลือแล้ว
        </v-card-text>
        <v-card-text class="font-weight-black"> เบอร์โทร : </v-card-text>
        <v-card-text class="font-weight-black"> ที่อยู่ปัจจุบัน : </v-card-text>
        <v-card-text class="font-weight-black"> ระดับอาการ : </v-card-text>
        <v-card-text class="font-weight-black"> ข้อความ:เข้าระบบ :</v-card-text>
        <v-card-text class=".text-sm-body-2">
          -วันที่ 20 ส.ค.2564 ได้แนะนำการดูแลตนเอง และยาที่ใช้การบรรเทาอาการ
          และการกินยาและมีอาการดีขึ้น
        </v-card-text>
        <br />

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            นำทาง
          </v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">
            อัพเดทสถานนะ
          </v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">
            ดูรายละเอียดเพิ่มเติม
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
