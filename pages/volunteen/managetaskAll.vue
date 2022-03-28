<template>
  <v-container>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        รายละเอียดการขอความช่วยเหลือ
        <v-spacer></v-spacer>
      </v-card-title>
      <v-form ref="form_remark" v-model="valid" lazy-validation class="px-4">
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
              ช่วยเหลือเสร็จสิ้น
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-row class="px-4">
                <v-col cols="12"
                  ><v-card-title class="pa-0"
                    >ตำแหน่งที่อยู่</v-card-title
                  ></v-col
                >
                <v-col cols="12">
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
                </v-col>
                <br />
                <v-col cols="12">
                  <v-textarea
                    rows="3"
                    no-resize
                    label="รายละเอียดที่อยู่"
                    outlined
                    required
                  ></v-textarea> </v-col
                ><v-col cols="12" class="pt-0">
                  <v-card-title class="pa-0">ข้อมูลผู้ป่วย</v-card-title>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="ขื่อ" outlined> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="นามสกุล" outlined> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="เบอร์โทร" outlined> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="วันเดือนปีเกิด" outlined> </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="selectedTypes"
                    :items="types"
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
                <v-col cols="12" class="mb-4" style="text-align: end">
                  <v-btn color="error" class="mr-3">
                    ยกเลิกขอความช่วยเหลือ
                  </v-btn>
                  <v-btn color="primary" @click="nextStep(1)">
                    เข้าช่วยเหลือ
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-row class="px-4">
                <v-col cols="12">
                  <v-card-title class="pa-0"
                    >อาสาสมัครผู้ดำเนินการ</v-card-title
                  >
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="ขื่อ" outlined> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="นามสกุล" outlined> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field label="เบอร์โทร" outlined> </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-card-title class="pa-0"
                    >รายละเอียดการช่วยเหลือ</v-card-title
                  >
                </v-col>
                <v-col cols="12">
                  <table class="table" style="width: 100%">
                    <thead>
                      <tr>
                        <td>วันที่</td>
                        <td class="pl-3">รายละเอียดการช่วยเหลือ</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td>
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                          <!-- <v-text-field
                            v-model="item.title"
                            label="นามสกุล"
                            outlined
                          >
                          </v-text-field> -->
                        </td>
                        <td>
                          <v-text-field
                            v-model="item.description"
                            label="รายละเอียด"
                            outlined
                            class="ml-3"
                          >
                          </v-text-field>
                        </td>
                        <td style="text-align: right">
                          <v-btn
                            v-on:click="addItem"
                            v-if="items.length - 1 <= index"
                            v-bind:class="{
                              disabled:
                                item.title.length == 0 ||
                                item.description.length == 0,
                            }"
                            color="success"
                            class="mr-3"
                            style="margin-top: -32px"
                          >
                            เพิ่ม
                          </v-btn>
                          <v-btn
                            v-on:click="removeItem(index)"
                            v-if="
                              items.length - 1 >= index &&
                              items.length - 1 != index
                            "
                            color="error"
                            style="margin-top: -32px; margin-right: 12px"
                          >
                            ลบ
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- <v-textarea
                    rows="3"
                    no-resize
                    label="รายละเอียดการช่วยเหลือ"
                    outlined
                    required
                  ></v-textarea > -->
                  <v-divider class="mt-2"></v-divider>
                </v-col>

                <v-col cols="12" class="mb-4" style="text-align: end">
                  <!-- <v-btn color="warning" class="mr-3"> บันทึกข้อมูล </v-btn> -->
                  <v-btn color="primary" @click="nextStep(2)">
                    ช่วยเหลือเสร็จสิ้น
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-row class="px-4">
                <v-col cols="12"
                  ><v-card-title class="pa-0">หมายเหตุ</v-card-title></v-col
                >
                <v-col cols="12"
                  ><v-textarea
                    rows="3"
                    no-resize
                    label="หมายเหตุ"
                    outlined
                    required
                  ></v-textarea
                ></v-col>
                <v-col cols="12" class="mb-4" style="text-align: end">
                  <v-btn color="primary" @click="nextStep(3)">
                    เสร็จสิ้น
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      e1: 1,
      steps: 4,
      taskData: {
        remark: '',
        id: '',
        status_id: '',
        canceldetail: 'fs',
      },
      image1: '',
      image2: '',
      markers: [],
      place: null,
      currentLocation: { lat: 13, lng: 100 },
      lat: 0,
      lng: 0,
      types: ['สถานที่รักษา', 'อาหาร / ยา / ของใช้', 'รถรับส่ง'],
      selectedTypes: [],
      items: [
        {
          title: '',
          description: '',
        },
      ],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
    }
  },

  computed: {
    likesAllFruit() {
      return this.selectedTypes.length === this.types.length
    },
    likesSomeFruit() {
      return this.selectedTypes.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
  },

  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedTypes = []
        } else {
          this.selectedTypes = this.types.slice()
        }
      })
    },
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
    addItem: function () {
      this.items.push({
        title: '',
        description: '',
      })
    },
    removeItem: function (index) {
      this.items.splice(index, 1)
    },
  },
  mounted: function () {
    this.geolocation()
  },
}
</script>
