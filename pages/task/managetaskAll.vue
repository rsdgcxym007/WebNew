<template>
  <v-container>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        รายละเอียดการขอความช่วยเหลือ
        <v-spacer></v-spacer>
      </v-card-title>
      <v-form ref="form_remark" lazy-validation class="px-4">
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" :step="1" editable>
              ขอความช่วยเหลือ
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="e1 > 2"
              :step="2"
              :editable="
                taskData.status_id == $constants.DATA.HELPING_STATUS ||
                taskData.status_id == $constants.DATA.HELP_DONE_STATUS
              "
            >
              กำลังช่วยเหลือ
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="e1 > 3"
              :step="3"
              :editable="taskData.status_id == $constants.DATA.HELP_DONE_STATUS"
            >
              ช่วยเหลือเสร็จสิ้น
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-row class="px-4">
                <v-col cols="12">
                  <v-card-title class="pa-0">ตำแหน่งที่อยู่</v-card-title>
                  <v-switch
                    v-if="
                      $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    v-model="isOldAddress"
                    inset
                    label="ใช้ที่อยู่เดิม"
                  ></v-switch>
                </v-col>
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
                    @click="usePlace"
                    :disabled="isDisabledSearch"
                    >ค้นหา</v-btn
                  >
                </v-col>
                <v-col cols="12">
                  <Gmap-Map
                    style="width: 100%; height: 300px; margin: auto"
                    :zoom="zoom"
                    :center="center"
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
                    <!-- <Gmap-Marker
                      v-for="(marker, index) in markers"
                      :key="index"
                      :position="marker.position"
                    ></Gmap-Marker> -->
                    <!-- <Gmap-Marker
                      v-if="this.place"
                      label="&#x2605;"
                      :position="{
                        lat: this.place.geometry.location.lat(),
                        lng: this.place.geometry.location.lng(),
                      }"
                    ></Gmap-Marker> -->
                    <Gmap-Marker
                      v-if="taskData.position"
                      :position="taskData.position"
                      :clickable="true"
                      :draggable="!isOldAddress"
                      @click="center = position"
                      @dragend="updatePosition"
                    ></Gmap-Marker>
                  </Gmap-Map>
                </v-col>
                <br />
                <v-col cols="12">
                  <v-textarea
                    v-model="taskData.address_from_gmap"
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
                    v-model="taskData.address_from_user"
                    label="รายละเอียดที่อยู่เพิ่มเติม"
                    rows="3"
                    no-resize
                    outlined
                    required
                    :disabled="isOldAddress"
                  ></v-textarea>
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" class="pt-0">
                  <v-card-title class="pa-0">ข้อมูลผู้ป่วย</v-card-title>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="taskData.user_firstname"
                    label="ขื่อ"
                    outlined
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="taskData.user_lastname"
                    label="นามสกุล"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="taskData.user_tel"
                    label="เบอร์โทร"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <!-- <v-col cols="12" lg="6" class="pb-0">
                  <v-text-field label="วันเดือนปีเกิด" outlined disabled>
                  </v-text-field>
                </v-col> -->
                <v-col
                  v-if="
                    $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                    taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                  "
                  cols="12"
                  class="pt-0"
                  align="end"
                >
                  <nuxt-link to="/users" class="nav-link"
                    >แก้ไขข้อมูลส่วนตัว</nuxt-link
                  >
                </v-col>
                <v-col cols="12" class="pt-0">
                  <v-card-title class="pa-0"
                    >รายละเอียดการขอความช่วยเหลือ</v-card-title
                  >
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="selectedTypes"
                    :items="types"
                    label="ประเภทของความช่วยเหลือที่ต้องการ"
                    multiple
                    outlined
                    :disabled="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP ||
                      taskData.status_id !== $constants.DATA.ASK_FOR_HELP_STATUS
                    "
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
                <v-col
                  ><v-textarea
                    v-model="taskData.remark"
                    rows="3"
                    no-resize
                    label="หมายเหตุ"
                    outlined
                    required
                    :disabled="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP ||
                      taskData.status_id !== $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                  ></v-textarea
                ></v-col>
                <v-col cols="12" class="mb-4" style="text-align: end">
                  <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    :disabled="isReset"
                    color="warning"
                    class="mr-4"
                    @click="resetForm"
                  >
                    คืนค่า
                  </v-btn>
                  <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    color="success"
                    class="mr-3"
                  >
                    บันทึกการแก้ไข
                  </v-btn>
                  <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    color="error"
                    class="mr-3"
                  >
                    ยกเลิกขอความช่วยเหลือ
                  </v-btn>
                  <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    color="primary"
                    @click="updateData()"
                  >
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
                  <v-text-field
                    label="ขื่อ"
                    v-model="taskData.volunteer_firstname"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    label="นามสกุล"
                    v-model="taskData.volunteer_lastname"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    label="เบอร์โทร"
                    v-model="taskData.volunteer_tel"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  v-if="
                    $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                    taskData.status_id == $constants.DATA.HELPING_STATUS
                  "
                  cols="12"
                  class="pt-0"
                  align="end"
                >
                  <nuxt-link to="/users" class="nav-link"
                    >แก้ไขข้อมูลส่วนตัว</nuxt-link
                  >
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
                  <!-- <v-divider class="mt-2"></v-divider> -->
                </v-col>
                <v-col
                  v-if="
                    $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                    taskData.status_id == $constants.DATA.HELPING_STATUS
                  "
                  cols="12"
                  class="pt-0"
                  align="end"
                >
                  <nuxt-link to="/users" class="nav-link"
                    >บันทึกรายละเอียดการช่วยเหลือ</nuxt-link
                  >
                  <v-divider class="mt-2"></v-divider>
                </v-col>

                <v-col cols="12" class="mb-4" style="text-align: end">
                  <!-- <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                      taskData.status_id == $constants.DATA.HELPING_STATUS
                    "
                    color="warning"
                    class="mr-3"
                  >
                    บันทึกข้อมูล
                  </v-btn> -->
                  <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                      taskData.status_id == $constants.DATA.HELPING_STATUS
                    "
                    color="primary"
                    @click="updateData()"
                  >
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
                  <v-btn color="primary"> เสร็จสิ้น </v-btn>
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
  middleware: 'auth',
  data() {
    return {
      e1: 1,
      steps: 4,
      taskData: {
        remark: '',
        id: '',
        status_id: '',
        cancel_detail: '',
        volunteer_id: '',
        volunteer_firstname: '',
        volunteer_lastname: '',
        volunteer_tel: '',
        user_firstname: '',
        user_lastname: '',
        user_tel: '',
        position: null,
        address_from_user: '',
        address_from_gmap: '',
        address_id: '',
        requirement: [],
      },
      // users: {
      //   id: '',
      //   first_name: '',
      //   last_name: '',
      //   email: '',
      //   tel: '',
      //   address: '',
      //   position: null,
      //   address_from_user: '',
      //   address_from_gmap: '',
      // },
      isOldAddress: true,
      zoom: 12,
      center: { lat: 13.736717, lng: 100.523186 },
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

  async mounted() {
    this.geolocation()
    await this.fetchData()
  },

  computed: {
    likesAllFruit() {
      return this.selectedTypes.length === this.types.length
    },
    likesSomeFruit() {
      return this.selectedTypes.length > 0 && !this.likesAllFruit
    },
    icon() {
      console.log('icon')

      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    isDisableAddress() {
      return this.$auth.user.group_id == this.$constants.DATA.VOLUNTEER_GROUP
    },
    isDisabledSearch() {
      return !this.place
    },
    isSaveEdit() {},
    isReset() {},
  },

  watch: {
    steps(val) {
      console.log('value Steps: ',val)
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    isOldAddress(newValue) {
      console.log(newValue)
      if (newValue == true) {
        const taskInfo = this.$store.state.taskInfo

        this.taskData.position = taskInfo.position
        this.taskData.address_from_gmap = taskInfo.address_from_gmap
        this.taskData.address_from_user = taskInfo.address_from_user
        this.center = taskInfo.position
        this.address_id = taskInfo.address_id
        this.zoom = 16
      } else {
        this.taskData.position = null
        this.taskData.address_from_gmap = ''
        this.taskData.address_from_user = ''
        this.taskData.address_id = ''
        this.center = { lat: 13.736717, lng: 100.523186 }
        this.zoom = 10
      }
    },
  },

  methods: {
    async fetchData() {
      const { result: tasks } = await this.$axios.$post('/api/tasks/getbyId', {
        id: this.$route.query.id,
      })
      this.taskData = tasks
      console.log('Task Data: ', this.taskData)
      this.center = this.taskData.position
      // if (this.taskData.volunteer_id) {
      //   const { result } = await this.$axios.$post('/api/user/getbyID', {
      //     id: this.taskData.volunteer_id,
      //   })
      //   if (result) {
      //     this.taskData.volunteer_firstname = result.first_name
      //     this.taskData.volunteer_lastname = result.last_name
      //     this.taskData.volunteer_tel = result.tel
      //   }
      // }
      console.log('task requirement', this.taskData.requirement)
      if (this.taskData.status_id == this.$constants.DATA.ASK_FOR_HELP_STATUS) {
        this.e1 = 1
      } else if (
        this.taskData.status_id == this.$constants.DATA.HELPING_STATUS
      ) {
        this.e1 = 2
      } else if (
        this.taskData.status_id == this.$constants.DATA.HELP_DONE_STATUS
      ) {
        this.e1 = 3
      }

      // this.users.first_name = this.$store.state.userInfo.first_name
      // this.users.last_name = this.$store.state.userInfo.last_name
      // this.users.email = this.$store.state.userInfo.email
      // this.users.address = this.$store.state.userInfo.address
      // this.users.tel = this.$store.state.userInfo.tel
      // this.$store.commit('SET_taskInfo', {
      //   taskInfo: {
      //     remark: this.taskData.remark,
      //     status_id: this.taskData.status_id,
      //     cancel_detail: this.taskData.cancel_detail,
      //   },
      // })

      this.$store.commit('SET_taskInfo', {
        taskInfo: {
          remark: this.taskData.remark,
          status_id: this.taskData.status_id,
          cancel_detail: this.taskData.cancel_detail,
          position: this.taskData.position,
          address_from_gmap: this.taskData.address_from_gmap,
          address_from_user: this.taskData.address_from_user,
          address_id: this.taskData.address_id,
          requirement: this.taskData.requirement,
        },
      })
      this.selectedTypes = this.$store.state.taskInfo.requirement
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedTypes = []
        } else {
          this.selectedTypes = this.types.slice()
        }
      })
    },
    // nextStep(n) {
    //   if (n === this.steps) {
    //     this.e1 = 1
    //   } else {
    //     this.e1 = n + 1
    //   }
    // },
    async resetForm() {
      const taskInfo = await this.$store.state.taskInfo

      this.selectedTypes = taskInfo.requirement
      this.taskData.remark = taskInfo.remark
    },
    async updateData() {
      if (
        this.taskData.status_id === this.$constants.DATA.ASK_FOR_HELP_STATUS
      ) {
        await this.updateHelping()
      } else if (
        this.taskData.status_id === this.$constants.DATA.HELPING_STATUS
      ) {
        await this.updateHelpDone()
      }
      // else if (
      //   this.taskData.status_id === '7c2f1759-f664-40d2-8184-c20f2e76c229' ||
      //   this.taskData.status_id === '490089af-cb09-476d-9568-a0896a50143a'
      // ) {
      //   //if just update remark
      //   await this.updateRemark()
      // } else {
      //   await this.uploadImage()
      // }
    },
    async updateHelping() {
      const { result, message } = await this.$axios.$post('/api/task/update', {
        id: this.taskData.id,
        status_id: this.$constants.DATA.HELPING_STATUS,
        volunteer_id: this.$auth.user.id,
      })
      if (!result) {
        console.log('error : ', message)
      } else {
        await this.fetchData()
      }
    },
    async updateHelpDone() {
      const { result, message } = await this.$axios.$post('/api/task/update', {
        id: this.taskData.id,
        status_id: this.$constants.DATA.HELP_DONE_STATUS,
      })
      if (!result) {
        console.log('error : ', message)
      } else {
        await this.fetchData()
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
    // setPlace(place) {
    //   this.place = place

    //   this.lat = this.place.geometry.location.lat()
    //   this.lng = this.place.geometry.location.lng()
    // },
    // usePlace(place) {
    //   if (this.place) {
    //     this.markers.push({
    //       position: {
    //         lat: this.place.geometry.location.lat(),
    //         lng: this.place.geometry.location.lng(),
    //       },
    //     })
    //     this.place = null
    //   }
    // },

    setPlace(place) {
      this.place = place
      console.log('current place', this.place)
      console.log('lat from place: ', place.geometry.location.lat())
      console.log('lat from place: ', place.geometry.location.lng())
    },

    usePlace() {
      if (this.place) {
        this.taskData.position = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }
        console.log('latlng from usePlace: ', this.taskData.position)
        console.log('latlng from usePlace: ', this.place.formatted_address)

        this.taskData.address_from_gmap = this.place.formatted_address
        this.zoom = 18
        this.center = this.taskData.position
        this.place = null
      }
    },
    updatePosition(location) {
      console.log('location after update: ', location)
      this.taskData.position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      }
      console.log('location: ', this.position)
      this.getAddressDetail(
        this.taskData.position.lat,
        this.taskData.position.lng
      )
    },

    async getAddressDetail(lat, lng) {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat, lng }

      await geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          console.log('result from getTown', results[0])
          this.taskData.address_from_gmap = results[0].formatted_address
        } else {
          console.log('No results found')
        }
      })
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