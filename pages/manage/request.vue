<template>
  <div>
    <v-container fluid>
      <v-card elevation="8" class="mx-4 pa-4">
        <v-card-title>
          ขอความช่วยเหลือ
          <v-spacer></v-spacer>
        </v-card-title>
        <v-form ref="form1" v-model="valid1" lazy-validation class="px-4">
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
              <div style="font-weight: 500">โรคประจำตัว</div>
              <v-textarea
                v-model="congenital_disease"
                label="รายละเอียดโรคประจำตัว"
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
              <div style="font-weight: 500">สิ่งที่ต้องการ</div>
              <v-select
                :rules="selectedTypesRules"
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
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="disableDialog"
                    color="success"
                    v-bind="attrs"
                    v-on="on"
                    >ขอความช่วยเหลือ</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>แบบประเมินระดับอาการ </v-card-title>
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12">
                          <div>
                            <h4>
                              1. ผู้ป่วยมีโรคประจำตัว 8 โรคร้ายแรงหรือไม่?
                            </h4>
                            <hr class="mb-5" />
                            <v-row>
                              <v-col
                                cols="12"
                                v-for="(item, index) in forCheckbox1"
                                :key="index"
                              >
                                <v-checkbox
                                  class="ma-0 pa-0"
                                  v-model="selectCheckbox"
                                  :label="item.label"
                                  color="red"
                                  :value="item.value"
                                  hide-details
                                ></v-checkbox
                              ></v-col>
                            </v-row>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <div>
                            <h4>2. ผู้ป่วยมีลักษณะอาการอย่างไรบ้าง?</h4>
                            <hr class="mb-5" />
                            <v-row>
                              <v-col
                                cols="12"
                                v-for="(item, index) in forCheckbox2"
                                :key="index"
                              >
                                <v-checkbox
                                  class="ma-0 pa-0"
                                  v-model="selectCheckbox2"
                                  :label="item.label"
                                  color="red"
                                  :value="item.value"
                                  hide-details
                                ></v-checkbox
                              ></v-col>
                            </v-row>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog">
                      Close
                    </v-btn>
                    <v-btn
                      class="pr-5"
                      color="blue darken-1"
                      text
                      @click="evaluate"
                      :disabled="disabledSave"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
      valid1: false,
      selectCheckbox: [],
      selectCheckbox2: [],
      forCheckbox1: [
        {
          label: 'ไตเรื้อรัง ผู้ป่วยฟอกไต และปลูกถ่ายไต',
          value: 'danger1',
          point: 35,
        },
        {
          label: 'เส้นเลือดหัวใจตีบ หัวใจเต้นผิดจังหวะ',
          value: 'danger2',
          point: 35,
        },
        { label: 'เบาหวาน', value: 'danger3', point: 35 },
        { label: 'ความดันโลหิตสูง', value: 'danger4', point: 35 },
        { label: 'หอบหืด ปอดอักเสบเรื้อรัง', value: 'danger5', point: 35 },
        { label: 'ตับแข็ง ตับอักเสบเรื้อรัง', value: 'danger6', point: 35 },
        { label: 'ภูมิคุ้มกันบกพร่อง', value: 'danger7', point: 35 },
        { label: 'อ้วน', value: 'danger8', point: 35 },
      ],
      forCheckbox2: [
        // Green Zone
        { label: 'มีไข้ต่ำๆ', value: 'green1', point: 1 },
        { label: 'ไอ , เจ็บคอ , มีน้ำมูก ', value: 'green2', point: 1 },
        { label: 'ตาแดง', value: 'green3', point: 1 },
        { label: 'ถ่ายเหลว', value: 'green4', point: 1 },
        { label: 'หายใจปกติ ไม่เหนื่อย', value: 'green5', point: 0 },
        // Yellow Zone
        { label: 'อ่อนเพลีย เวียนศรีษะ', value: 'yellow1', point: 5 },
        { label: 'แน่นหน้าอก', value: 'yellow2', point: 5 },
        { label: 'แน่นหน้าอกตลอดเวลา', value: 'yellow3', point: 5 },
        {
          label: 'เหนื่อยหอบ , หายใจลำบาก , หายใจเร็ว , ไอแล้วเหนื่อย',
          value: 'yellow4',
          point: 5,
        },
        { label: 'อาเจียน', value: 'yellow5', point: 5 },
        {
          label: 'ถ่ายเหลวไม่ต่ำกว่า 3 ครั้งต่อวัน',
          value: 'yellow6',
          point: 5,
        },
        // Red Zone
        { label: 'แน่นหน้าอกตลอดเวลา', value: 'red1', point: 35 },
        {
          label: 'เหนื่อยหอบตลอดเวลา , หายใจแล้วเจ็บหน้าอก',
          value: 'red2',
          point: 35,
        },
        { label: 'ไม่รู้สึกตัว , ซึม ตอบสนองช้า', value: 'red3', point: 35 },
      ],
      checkbox1: true,
      checkbox2: false,
      dialog: false,
      isOldAddress: true,
      selectedTypes: [],
      requirement: ['สถานที่รักษา', 'อาหาร / ยา / ของใช้', 'รถรับส่ง'],
      remark: '',
      level: '',
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
      diseaseRules: [(v) => !!v || 'กรุณาใส่ รายละเอียดโรคประจำตัว'],
      selectedTypesRules: [
        (v) => v.length > 0 || 'กรุณาเลือกความช่วยเหลือที่ต้องการ',
      ],
    }
  },
  async mounted() {
    if (this.$auth.user.group_id != '51b0e763-1f09-416a-afa9-d2f0ce78e9e6') {
      this.$router.push('/')
    }
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
    checkbox1(newValue) {
      if (newValue == false) {
        this.diseaseRules = ''
        this.congenital_disease = ''
      } else {
        this.diseaseRules = [(v) => !!v || 'กรุณาใส่ รายละเอียดโรคประจำตัว']
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
    disableDialog() {
      return (
        this.valid1 === false ||
        this.address_from_gmap == '' ||
        this.remark === '' ||
        this.selectedTypes == ''
      )
    },
    disabledSave() {
      return this.selectCheckbox2 == ''
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
    async request() {
      if (!this.address_from_gmap) {
        this.$swal({
          type: 'warning',
          title: 'กรุณาเพิ่มที่อยู่',
        })
        return false
      }
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
          level: this.level,
        }
        console.log('dato for sent: ', data)
        const { result, message } = await this.$axios.$post(
          '/api/tasks/create',
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
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        })
      }
    },
    async evaluate() {
      let sum = 0
      for (let i = 0; i < this.selectCheckbox.length; i++) {
        console.log('1111')
        let result = await this.forCheckbox1.find(
          (word) => word.value == this.selectCheckbox[i]
        ).point
        sum += result
      }
      for (let i = 0; i < this.selectCheckbox2.length; i++) {
        console.log('222')
        let result = await this.forCheckbox2.find(
          (word) => word.value == this.selectCheckbox2[i]
        ).point
        sum += result
      }
      console.log(sum)
      if (sum >= 35) {
        console.log('redzone')
        this.level = 'red'
      } else if (sum < 35 && sum > 4) {
        console.log('yellow zone')
        this.level = 'yellow'
      } else {
        console.log('green zone')
        this.level = 'green'
      }
      await this.request()
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
    closeDialog() {
      this.dialog = false
      this.selectCheckbox = ''
      this.selectCheckbox2 = ''
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
