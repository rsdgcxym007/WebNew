<template>

  <div>
    <v-card elevation="8" width="auto" class="mx-12 my-1 pa-4">
      <v-card-title>ข้อมูลส่วนตัว </v-card-title>
      <v-container>
        <notifications/>
        <v-form ref="form_user" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.first_name"
                :counter="20"
                :rules="FnameRules"
                label="ชื่อ"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.last_name"
                :counter="20"
                :rules="LnameRules"
                label="นามสกุล"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.email"
                label="E-mail"
                disabled
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="users.tel"
                :rules="TelRules"
                label="โทรศัพท์"
                :counter="10"
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">ที่อยู่</v-col>
            <!-- <v-col cols="10"> -->
            <v-col cols="9 " class="col-lg-11">
              <gmap-autocomplete
                placeholder="ค้นหาที่อยู่"
                @place_changed="setPlace"
                class="gsearch"
              >
              </gmap-autocomplete>
            </v-col>
            <!-- <v-col cols="2" align-self="center"> -->
            <v-col
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
                  :position="users.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center = users.position"
                  @dragend="updatePosition"
                />
                <!-- <gmap-info-window
                  :options="infoOptions"
                  :position="users.position"
                  :opened="infoOpened"
                  :content="infoContent"
                  :clickable="true"
                  @click="goToDetail"
                  @closeclick="infoOpened = false"
                >
                </gmap-info-window> -->
              </GmapMap>
            </v-col>
            <v-col>
              <v-textarea
                v-model="users.address_from_gmap"
                label="รายละเอียดที่อยู่จากหมุด"
                rows="2"
                no-resize
                outlined
                required
                disabled
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="users.address_from_user"
                label="รายละเอียดที่อยู่เพิ่มเติม"
                rows="2"
                no-resize
                outlined
                required
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="text-align: end">
              <v-btn
                :disabled="isReset"
                color="error"
                class="mr-4"
                @click="fetchData"
              >
                คืนค่า
              </v-btn>
              <!-- <v-btn :disabled="!valid" color="success" @click="updatedata"> -->
              <v-btn
                :disabled="isDisabled"
                color="success"
                @click="updateDataUser"
              >
                บันทึกข้อมูล
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      users: {
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        tel: '',
        position: null,
        address_from_user: '',
        address_from_gmap: '',
        address_id: '',
      },
      valid: '',
      FnameRules: [
        (v) => !!v || 'กรุณากรอก ชื่อ',
        (v) => (v && v.length <= 20) || 'กรุณากรอกชื่อไม่เกิน 20 ตัวอักษร',
      ],
      LnameRules: [
        (v) => !!v || 'กรุณากรอก นามสกุล',
        (v) => (v && v.length <= 20) || 'กรุณากรอกนามสกุลไม่เกิน 20 ตัวอักษร',
      ],
      emailRules: [
        (v) => !!v || 'กรุณากรอก Email',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      addressRules: [(v) => !!v || 'กรุณากรอกที่อยู่'],
      TelRules: [
        (v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์',
        (v) => /^\d{10}$/.test(v) || 'เบอร์โทรไม่ถูกต้อง',
      ],
      place: null,
      zoom: 7,
      center: { lat: 13.736717, lng: 100.523186 },
      address: '',
      toggleMarker: false,
      map: null,
      mapLoaded: false,
      infoContent: 'test Info Content',
      infoOpened: false,
      infoCurrentKey: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
        content:
          `<div>` +
          `<h3 class="infoWindow">ข้อมูลผู้ร้องขอ</h3> <hr/><br>` +
          `ชื่อ :${this.$store.state.userInfo.last_name} ${this.$store.state.userInfo.first_name}<br/>` +
          `เบอร์โทร :${this.$store.state.userInfo.tel}<br/>` +
          `<br/><hr/>` +
          `<a href="/volunteen/userhelp"} action="_blank"> ดูข้อมูล</a>` +
          `</div>`,
      },
    }
  },
  async mounted() {
    this.geolocation()
    await this.fetchData()
  },
  methods: {
    geolocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
    async fetchData() {
      const userInfo = this.$store.state.userInfo

      this.users.first_name = userInfo.first_name
      this.users.last_name = userInfo.last_name
      this.users.email = userInfo.email
      this.users.tel = userInfo.tel
      this.users.id = this.$auth.user.id
      this.users.position = userInfo.position
      this.users.address_from_gmap = userInfo.address_from_gmap
      this.users.address_from_user = userInfo.address_from_user
      this.users.address_id = userInfo.address_id
      this.center = userInfo.position
      this.zoom = 16
    },
    async updateDataUser() {
      if (this.$refs.form_user.validate() === true) {
        const data = {
          user_id: this.users.id,
          first_name: this.users.first_name,
          last_name: this.users.last_name,
          tel: this.users.tel,
          position: this.users.position,
          address_from_gmap: this.users.address_from_gmap,
          address_from_user: this.users.address_from_user,
          address_id: this.$store.state.userInfo.address_id,
        }
        const { result, message } = await this.$axios.$post(
          '/api/users/update',
          { data }
        )
        if (!result) {
          console.log('error: ', message)
        } else {
          await this.$store.commit('SET_userInfo', {
            userInfo: {
              first_name: this.users.first_name,
              last_name: this.users.last_name,
              tel: this.users.tel,
              position: this.users.position,
              address_from_gmap: this.users.address_from_gmap,
              address_from_user: this.users.address_from_user,
              address_id: this.users.address_id,
            },
          })
          this.fetchData()
          this.$swal({
            type: 'success',
            text: 'อัพเดทข้อมูลเสร็จสิ้น',
            title: message,
          })
        }
      }
    },
    goToDetail() {
      console.log('ข้อมูลผู้ป่วย')
    },
    infoMap() {
      this.infoOpened = true
      console.log('marker info is: ', this.toggleMarker)
    },
    toggleInfo() {
      if (this.infoOpened == false) {
        this.infoOpened = true
        console.log('infoOpened change to: ', this.infoOpened)
      } else {
        this.infoOpened = false
        console.log('infoOpened change to: ', this.infoOpened)
      }
    },

    setPlace(place) {
      this.place = place
      console.log('current place', this.place)
    },
    usePlace() {
      if (this.place) {
        this.users.position = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }
        this.users.address_from_gmap = this.place.formatted_address
        this.zoom = 18
        this.center = this.users.position
        this.place = null
        console.log('address: ', this.address)
      }
    },

    updatePosition(location) {
      console.log('location after update: ', location)
      this.users.position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      }
      console.log('location: ', this.users.position)
      this.getAddressDetail(this.users.position.lat, this.users.position.lng)
    },

    async getAddressDetail(lat, lng) {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat, lng }

      await geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          console.log('result from getTown', results[0])
          this.users.address_from_gmap = results[0].formatted_address
        } else {
          console.log('No results found')
        }
      })
    },
  },
  computed: {
    isDisabled() {
      return (
        (this.users.first_name === this.$store.state.userInfo.first_name &&
          this.users.last_name === this.$store.state.userInfo.last_name &&
          this.users.address_from_user ===
            this.$store.state.userInfo.address_from_user &&
          this.users.tel === this.$store.state.userInfo.tel &&
          this.users.position === this.$store.state.userInfo.position) ||
        !this.valid
      )
    },
    isReset() {
      return (
        this.users.first_name === this.$store.state.userInfo.first_name &&
        this.users.last_name === this.$store.state.userInfo.last_name &&
        this.users.email === this.$store.state.userInfo.email &&
        this.users.address_from_user ===
          this.$store.state.userInfo.address_from_user &&
        this.users.tel === this.$store.state.userInfo.tel &&
        this.users.position === this.$store.state.userInfo.position
      )
    },
    isDisabledSearch() {
      return !this.place
    },
    isHideAddress() {
      return !this.users.address
    },
  },
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  v-card.cardRespond {
    padding: 2px;
    margin-left: 10px;
  }
}
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
h3.infoWindow {
  color: blueviolet;
}
</style>
