<template>
  <div>
    <v-card elevation="8" width="auto" class="mx-12 my-1 pa-4">
      <v-card-title>ข้อมูลส่วนตัว </v-card-title>
      <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
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
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">ที่อยู่</v-col>
            <v-col cols="10">
              <gmap-autocomplete
                placeholder="ค้นหาที่อยู่"
                @place_changed="setPlace"
                class="gsearch"
              >
              </gmap-autocomplete>
            </v-col>
            <v-col cols="2" align-self="center">
              <v-btn
                block
                color="primary"
                @click="usePlace()"
                :disabled="isDisabledSearch"
                >เพิ่ม</v-btn
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
            <v-col cols="12">
              <v-textarea
                v-model="users.address"
                :rules="addressRules"
                label="รายละเอียดที่อยู่"
                rows="3"
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
              <v-btn :disabled="isDisabled" color="success" @click="updatedata">
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
        address: '',
        position: null,
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
      console.log('User ID : ' + this.$auth.user.id)

      this.users.first_name = this.$store.state.userInfo.first_name
      this.users.last_name = this.$store.state.userInfo.last_name
      this.users.email = this.$store.state.userInfo.email
      this.users.address = this.$store.state.userInfo.address
      this.users.tel = this.$store.state.userInfo.tel
      this.users.id = this.$auth.user.id
    },
    async updatedata() {
      this.$refs.form.validate()
      if (this.$refs.form.validate() === true) {
        const { result, message } = await this.$axios.$post(
          '/api/user/update',
          this.users
        )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$store.commit('SET_userInfo', {
            userInfo: {
              first_name: this.users.first_name,
              last_name: this.users.last_name,
              email: this.users.email,
              tel: this.users.tel,
              address: this.users.address,
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
    },
    usePlace() {
      if (this.place) {
        this.users.position = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }
        this.zoom = 18
        this.center = this.users.position
        this.place = null
      }
    },
    updatePosition(location) {
      this.users.position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      }
    },
  },
  computed: {
    isDisabled() {
      return (
        (this.users.first_name === this.$store.state.userInfo.first_name &&
          this.users.last_name === this.$store.state.userInfo.last_name &&
          this.users.email === this.$store.state.userInfo.email &&
          this.users.address === this.$store.state.userInfo.address &&
          this.users.tel === this.$store.state.userInfo.tel) ||
        !this.valid
      )
    },
    isReset() {
      return (
        this.users.first_name === this.$store.state.userInfo.first_name &&
        this.users.last_name === this.$store.state.userInfo.last_name &&
        this.users.email === this.$store.state.userInfo.email &&
        this.users.address === this.$store.state.userInfo.address &&
        this.users.tel === this.$store.state.userInfo.tel
      )
    },
    isDisabledSearch() {
      return !this.place
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
