<template>
  <div>
    <v-card elevation="8" width="auto" class="mx-12 my-1 pa-4">
      <v-card-title v-if="users.group_id == $constants.DATA.PATIENT_GROUP"
        >ข้อมูลผู้ใช้งาน (ผู้ป่วย)
      </v-card-title>
      <v-card-title v-if="users.group_id == $constants.DATA.VOLUNTEER_GROUP"
        >ข้อมูลผู้ใช้งาน (อาสา)
      </v-card-title>
      <v-container>
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
      const { result } = await this.$axios.$post('/api/user/getbyID', {
        id: this.$route.query.id,
      })
      console.log('editban', result)
      ;(this.users = result), (this.zoom = 16)
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
          '/api/user/update',
          { data }
        )
        if (!result) {
          console.log('error: ', message)
        } else {
          await this.$store.commit('SET_userInfo', {
            users: {
              first_name: this.users.first_name,
              last_name: this.users.last_name,
              tel: this.users.tel,
              position: this.users.position,
              address_from_gmap: this.users.address_from_gmap,
              address_from_user: this.users.address_from_user,
            },
          })
          this.$swal({
            type: 'success',
            title: message,
          })
        }
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

<style>
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
</style>
