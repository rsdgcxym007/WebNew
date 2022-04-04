<template>
  <div>
    <v-container fluid>
      <v-card elevation="8" class="mx-4 pa-4">
        <v-card-title>
          ขอความช่วยเหลือ
          <v-spacer></v-spacer>
        </v-card-title>
        <v-form ref="form1" lazy-validation class="px-4">
          <v-row>
            <v-col cols="12"
              ><div style="font-weight: 500">ที่อยู่</div>
              <v-switch
                v-model="isOldAddress"
                inset
                label="ใช้ที่อยู่ปัจจุบัน"
              ></v-switch
            ></v-col>
            <!-- <v-col cols="12">ที่อยู่</v-col> -->
            <v-col v-if="!isOldAddress" cols="9 " class="col-lg-11">
              <gmap-autocomplete
                placeholder="ค้นหาที่อยู่"
                @place_changed="setPlace"
                class="gsearch"
              >
              </gmap-autocomplete>
            </v-col>
            <v-col
              v-if="!isOldAddress"
              cols="3"
              align-self="center"
              class="col-lg-1 py-0 pl-0 pr-3 ma-0"
            >
              <v-btn
                block
                color="primary"
                @click="usePlace()"
                :disabled="isDisabledSearch"
                >ค้นหา</v-btn
              >
            </v-col>
            <v-col cols="12">
              <GmapMap
                :center="center"
                :zoom="zoom"
                map-type-id="terrain"
                style="width: 100%; height: 300px"
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
                <GmapMarker
                  :position="position"
                  :clickable="true"
                  :draggable="!isOldAddress"
                  @click="center = position"
                  @dragend="updatePosition"
                />
              </GmapMap>
            </v-col>
            <v-col>
              <v-textarea
                v-model="address_from_gmap"
                label="รายละเอียดที่อยู่จากหมุด"
                rows="3"
                no-resize
                outlined
                required
                disabled
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="address_from_user"
                label="รายละเอียดที่อยู่เพิ่มเติม"
                rows="3"
                no-resize
                outlined
                required
                :disabled="isOldAddress"
              ></v-textarea>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <div style="font-weight: 500">อาการ</div>
              <v-textarea
                v-model="remark"
                :rules="remarkRules"
                label="คำอธิบายอาการเบื้องต้น"
                outlined
                rows="3"
                required
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="congenital_disease"
                label="โรคประจำตัว"
                outlined
                rows="2"
                required
              ></v-textarea>
            </v-col>
            <!-- <v-col cols="12">
              <div style="font-weight: 500">ประเมินระดับอาการเบื้องต้น</div>
              <v-radio-group
                v-model="patient_group"
                v-on:change="changePatientGroup"
              >
                <v-radio
                  label="กลุ่มสีเขียว (กลุ่มที่มีอาการเบาคล้ายไข้หวัด หรือไม่มีอาการเลย เช่น มีไข้ ไม่รับรส ไม่รับกลิ่น ไอ มีน้ำมูก เจ็บคอ ตาแดง มีผื่น และถ่ายเหลว)"
                  value="green"
                ></v-radio>
                <div v-if="patient_group == 'green'" class="pl-8">
                  <div style="color: rgba(0, 0, 0, 0.6); font-weight: 500">
                    สถานที่รักษาที่ต้องการ
                  </div>
                  <v-radio-group v-model="isolation" class="mt-0">
                    <v-radio
                      label="Home Isolation : การรักษาด้วยการกักตัวอยู่ที่บ้าน โดยจะได้รับการดูแลพร้อมอุปกรณ์ขั้นพื้นฐาน"
                      value="home"
                    ></v-radio>
                    <v-radio
                      label="Hospitel : ต้องใช้ใบยืนยันผลการตรวจแบบ RT-PCR"
                      value="hospitel"
                    ></v-radio
                  ></v-radio-group>
                </div>
                <v-radio
                  class="mt-4"
                  label="กลุ่มสีเหลือง (กลุ่มที่มีอาการเสี่ยงรุนแรง หรือมีโรคร่วม เช่น เวียนหัว อ่อนเพลีย ไอแล้วมีอาการเหนื่อย แน่นหน้าอก หายใจลำบาก ขับถ่ายเหลว 3 ครั้งต่อวันขึ้นไป อ่อนเพลีย ปอดอักเสบ)"
                  value="yellow"
                ></v-radio>
                <div v-if="patient_group == 'yellow'" class="pl-8">
                  <div style="color: rgba(0, 0, 0, 0.6); font-weight: 500">
                    สถานที่รักษาที่ต้องการ
                  </div>
                  <v-radio-group v-model="isolation" class="mt-0">
                    <v-radio label="โรงพยาบาล" value="hospital"></v-radio
                  ></v-radio-group>
                </div>
                <v-radio
                  class="mt-4"
                  label="กลุ่มสีแดง (กลุ่มที่มีอาการรุนแรงต้องรีบเข้ารับการรักษาตัวโดยเร็ว เช่น ระบบหายใจมีปัญหารุนแรงทำให้หายใจลำบาก หอบเหนื่อย หากเอกซเรย์จะพบปอดอักเสบรุนแรง แน่นหน้าอกตลอดเวลา และหายใจเจ็บหน้าอก ตอบสนองช้า หรือไม่รู้สึกตัว)"
                  value="red"
                ></v-radio>
                <div v-if="patient_group == 'red'" class="pl-8">
                  <div style="color: rgba(0, 0, 0, 0.6); font-weight: 500">
                    สถานที่รักษาที่ต้องการ
                  </div>
                  <v-radio-group v-model="isolation" class="mt-0">
                    <v-radio label="โรงพยาบาล" value="hospital"></v-radio
                  ></v-radio-group>
                </div>
              </v-radio-group>
            </v-col> -->
            <v-col cols="12">
              <v-select
                v-model="selectedTypes"
                :items="requirement"
                label="ประเภทของความช่วยเหลือที่ต้องการ"
                multiple
                outlined
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="toggle">
                    <v-list-item-action>
                      <v-icon
                        :color="
                          selectedTypes.length > 0 ? 'indigo darken-4' : ''
                        "
                      >
                        {{ icon }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title> เลือกทั้งหมด </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" style="text-align: end">
              <v-btn color="success" @click="request()">ขอความช่วยเหลือ</v-btn>
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
      isOldAddress: true,
      selectedTypes: [],
      requirement: ['สถานที่รักษา', 'อาหาร / ยา / ของใช้', 'รถรับส่ง'],
      remark: '',
      congenital_disease: '',
      patient_group: '',
      isolation: '',
      user_id: this.$auth.user.id,
      position: null,
      address_from_gmap: '',
      address_from_user: '',
      address_id: '',
      valid: '',
      place: null,
      zoom: 7,
      center: { lat: 13.736717, lng: 100.523186 },
      remarkRules: [(v) => !!v || 'กรุณาใส่ คำอธิบาย อาการเบื้องต้น'],
    }
  },
  async fetch() {
    if (this.$auth.user.group_id != '51b0e763-1f09-416a-afa9-d2f0ce78e9e6') {
      this.$router.push('/')
    }
  },
  async mounted() {
    await this.fetchData()
  },
  watch: {
    isOldAddress(newValue) {
      console.log(newValue)
      if (newValue == true) {
        const userInfo = this.$store.state.userInfo

        this.position = userInfo.position
        this.address_from_gmap = userInfo.address_from_gmap
        this.address_from_user = userInfo.address_from_user
        this.center = userInfo.position
        this.address_id = userInfo.address_id
        this.zoom = 16
      } else {
        this.position = null
        this.address_from_gmap = ''
        this.address_from_user = ''
        this.address_id = ''
        this.center = { lat: 13.736717, lng: 100.523186 }
        this.zoom = 8
      }
    },
  },
  computed: {
    likesAllFruit() {
      return this.selectedTypes.length === this.requirement.length
    },
    likesSomeFruit() {
      return this.selectedTypes.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    isDisabledSearch() {
      return !this.place
    },
  },
  methods: {
    fetchData() {
      const userInfo = this.$store.state.userInfo

      this.position = userInfo.position
      this.address_from_gmap = userInfo.address_from_gmap
      this.address_from_user = userInfo.address_from_user
      this.center = userInfo.position
      this.address_id = userInfo.address_id
      this.zoom = 16
    },
    // async request() {
    //   this.$refs.form1.validate()
    //   if (this.$refs.form1.validate() === true) {
    //     const body = {
    //       type: 'ป่วย',
    //       remark: '',
    //       user_id: this.user_id,
    //       status_id: 'ขอความช่วยเหลือ',
    //     }
    //     const { result, message } = await this.$axios.$post(
    //       '/api/manage/request',
    //       body
    //     )

    //     if (!result) {
    //       console.log('error : ', message)
    //     } else {
    //       this.$swal({
    //         type: 'success',
    //         title: message,
    //       })
    //       this.$router.push({ path: '/manage' })
    //     }
    //   }
    // },
    async request() {
      if (this.$refs.form1.validate() === true) {
        const data = {
          status: 'ขอความช่วยเหลือ',
          user_id: this.user_id,
          position: this.position,
          address_from_gmap: this.address_from_gmap,
          address_from_user: this.address_from_user,
          remark: this.remark,
          congenital_disease: this.congenital_disease,
          treatment_location: this.isolation,
          requirement: this.selectedTypes,
        }
        console.log('dato for sent: ', data)
        const { result, message } = await this.$axios.$post(
          '/api/user/request',
          { data }
        )
        if (!result) {
          console.log('error: ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
            timer: 1500,
          })
          this.$router.push({ path: '/manage' })
        }
      } else {
        this.$swal({
          type: 'warning',
          message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        })
        this.$router.push({ path: '/manage' })
      }
    },
    changePatientGroup() {
      if (this.patient_group == 'green') {
        this.isolation = 'home'
      } else {
        this.isolation = 'hospital'
      }
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedTypes = []
        } else {
          this.selectedTypes = this.requirement.slice()
        }
      })
    },
    
    setPlace(place) {
      this.place = place
      console.log('current place', this.place)
    },

    usePlace() {
      if (this.place) {
        this.position = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }
        this.address_from_gmap = this.place.formatted_address
        this.zoom = 18
        this.center = this.position
        this.place = null
        console.log('address: ', this.address)
      }
    },

    updatePosition(location) {
      console.log('location after update: ', location)
      this.position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      }
      console.log('location: ', this.position)
      this.getAddressDetail(this.position.lat, this.position.lng)
    },

    async getAddressDetail(lat, lng) {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat, lng }

      await geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          console.log('result from getTown', results[0])
          this.address_from_gmap = results[0].formatted_address
        } else {
          console.log('No results found')
        }
      })
    },
  },
}
</script>
<style scoped>
.gsearch {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  max-height: 56px;
  flex: 1 1 auto;
  line-height: 20px;
  padding: 16px 8px;
  max-width: 100%;
  min-width: 0px;
  width: 100%;
}
</style>
