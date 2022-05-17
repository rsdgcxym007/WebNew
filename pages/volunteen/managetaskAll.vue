<template>
  <v-container>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        อัพเดทอาการปัจจุบัน
        <v-spacer></v-spacer>
      </v-card-title>
      <v-form ref="form_remark" v-model="valid" lazy-validation class="px-4">
        <!-- <v-textarea
          v-model="taskData.remark"
          :rules="remarkRules"
          rows="3"
          no-resize
          label="อัพเดทอาการปัจจุบัน"
          outlined
          :disabled="checkStatus"
          required
        ></v-textarea> -->
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" :step="1" editable>
              ขอความช่วยเหลือ
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" :step="2" editable>
              กำลังช่วยเหลือ
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" :step="3" editable>
              กรอกข้อมูลหายป่วย
            </v-stepper-step>
            <v-divider></v-divider>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="mb-12">
                <v-card-title>ตำแหน่ง</v-card-title>
                <Gmap-Map
                  style="width: 100%; height: 300px; margin: auto"
                  :zoom="7"
                  :center="{
                    lat: currentLocation.lat,
                    lng: currentLocation.lng,
                  }"
                  :options="{
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: true,
                    rotateControl: false,
                    fullscreenControl: true,
                    disableDefaultUi: false,
                  }"
                >
                  <Gmap-Marker
                    v-for="(marker, index) in markers"
                    :key="index"
                    :position="marker.position"
                  ></Gmap-Marker>
                  <Gmap-Marker
                    v-if="this.place"
                    label="&#x2605;"
                    :position="{
                      lat: this.place.geometry.location.lat(),
                      lng: this.place.geometry.location.lng(),
                    }"
                  ></Gmap-Marker>
                </Gmap-Map>
                <br />
                <v-card-title>รายละเอียดที่อยู่ :</v-card-title>
                <v-text-field label="รายละเอียดที่อยู่" outlined>
                </v-text-field>
                <v-card-title>รายละเอียดผู้ป่วย :</v-card-title>
                <v-text-field label="ขื่อ" outlined> </v-text-field>
                <v-text-field label="นามสกุล" outlined> </v-text-field>
                <v-text-field label="เบอร์โทร" outlined> </v-text-field>
                <v-text-field label="วันเดือนปีเกิด" outlined> </v-text-field>
                <v-card-title>ประเภทของความช่วยเหลือที่ต้องการ :</v-card-title>
                <v-text-field label="ป่วย :" outlined> </v-text-field>
              </v-card>
              <v-btn color="primary" @click="nextStep(1)">
                เข้าช่วยเหลือ
              </v-btn>
              <v-btn text> ยกเลิกขอความช่วยเหลือ </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card class="mb-12">
                <v-card-title>อาสาสมัคผู้ดำเนินการ</v-card-title>
                <v-text-field label="ขื่อ" outlined> </v-text-field>
                <v-text-field label="นามสกุล" outlined> </v-text-field>
                <v-text-field label="เบอร์โทร" outlined> </v-text-field>
                <v-card-title>สถานที่รักษา</v-card-title>
                <v-text-field label="สถานที่รักษา" outlined> </v-text-field>
                <v-card-title>การติดตามอาการ</v-card-title>
              </v-card>
              <v-btn color="primary" @click="nextStep(2)"> หายป่วยแล้ว </v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-card class="mb-12">
                <!-- <v-col cols="12"> -->
                <div>
                  <label>ผลตรวจเชื้อแบบ RT-PCR</label>
                </div>
                <div v-if="image1">
                  <img :src="image1" width="300" height="100%" />
                </div>
                <div>
                  <input type="file" accept="image/*" />
                </div>
                <!-- </v-col> -->
                <!-- <v-col cols="12"> -->
                <div>
                  <label>ใบรับรองแพทย์</label>
                </div>
                <div v-if="image2">
                  <img :src="image2" width="300" height="100%" />
                </div>
                <v-card-title>ความคิดเห็นผู้ป่วย :</v-card-title>
                <v-text-field label="ความคิดเห็น" outlined> </v-text-field>
                <v-card-title>ความคิดเห็นอาสา :</v-card-title>
                <v-text-field label="ความคิดเห็นอาสา" outlined> </v-text-field>
              </v-card>

              <v-btn color="primary" @click="nextStep(3)"> เสร็จสิ้น </v-btn>
              <v-stepper-content step="4">
                <v-card class="mb-12"> </v-card>

                <v-btn color="primary" @click="nextStep(4)"> Continue </v-btn>

                <v-btn text> Cancel </v-btn>
              </v-stepper-content>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      e1: 1,
      steps: 4,
      //   taskData: {
      //     remark: '',
      //     id: '',
      //     status_id: '',
      //     canceldetail: 'fs',
      //   },
      image1: '',
      image2: '',
      markers: [],
      place: null,
      currentLocation: { lat: 13, lng: 100 },
      lat: 0,
      lng: 0,
    }
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
  },

  methods: {
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    },
    geolocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
    setDescription(description) {
      this.description = description
    },
    setPlace(place) {
      this.place = place

      this.lat = this.place.geometry.location.lat()
      this.lng = this.place.geometry.location.lng()
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          },
        })
        this.place = null
      }
    },
  },
  mounted: function () {
    this.geolocation()
  },
}
</script>
