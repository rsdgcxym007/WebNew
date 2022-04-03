<template>
  <div>
    <!-- <pre>{{ lists }}</pre> -->
    <br />
    <div class="black--text text-left text-h3">
      สถานการณ์ผู้ติดเชื้อไวรัส COVID-19
    </div>
    <div class="black--text text-left text-h5">
      วันที่ : {{ lists.txn_date}} อัพเดทวันที่ : {{ lists.update_date }}
    </div>
    <v-row class="mt-5">
      <v-col cols="4">
        <v-card class="mx-auto pa-3" color="warning" max-width="400">
          <div class="white--text text-center">ผู้ติดเชื้อสะสม</div>
          <div class="white--text text-center text-h5">
            {{ Number(lists.total_case).toLocaleString() }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="white--text text-center">
            เพิ่ม {{ Number(lists.new_case).toLocaleString() }} ราย
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto pa-3" color="success" max-width="400">
          <div class="white--text text-center">ผู้หายป่วยสะสม</div>
          <div class="white--text text-center text-h5">
            {{ Number(lists.total_recovered).toLocaleString() }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="white--text text-center">
            เพิ่ม {{ Number(lists.new_recovered).toLocaleString() }} ราย
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto pa-3" color="error" max-width="400">
          <div class="white--text text-center">ผู้เสียชีวิต</div>
          <div class="white--text text-center text-h5">
            {{ Number(lists.total_death).toLocaleString() }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="white--text text-center">
            เพิ่ม {{ Number(lists.new_death).toLocaleString() }} ราย
          </div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <Gmap-Map
          style="width: 100%; height: 400px"
          :zoom="7"
          :center="{ lat: currentLocation.lat, lng: currentLocation.lng }"
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
    </v-row>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return {
      lists: [],
      markers: [],
      place: null,
      currentLocation: { lat: 13, lng: 100 },
      lat: 0,
      lng: 0,
    }
  },
  mounted: function () {
    this.geolocation()
  },
  methods: {
    async fetchData() {
      const result = await this.$axios.$get(
        'https://covid19.ddc.moph.go.th/api/Cases/today-cases-all'
      )
      this.lists = result[0]
      console.log(this.lists)
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
}
</script>
<style>
element.style {
  color: brown;
}
.card-color {
  background: #f12711; /* fallback for old browsers */
  background: linear-gradient(#f12711, #f5af19);
}
</style>
