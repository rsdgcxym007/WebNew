<template>
  <div class="px-16">
    <!-- <pre>{{ lists }}</pre> -->
    <br />
    <div
      style="font-family: Prompt !important"
      class="black--text text-left text-h3"
    >
      สถานการณ์ผู้ติดเชื้อไวรัส COVID-19
    </div>
    <div
      style="font-family: Prompt !important"
      class="black--text text-left text-h5"
    >
      วันที่ : {{ moment(lists.txn_date) }} อัพเดทวันที่ :
      {{ moment(lists.update_date) }}
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
          :zoom="9"
          :center="{ lat: 13.736717, lng: 100.523186 }"
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
            v-for="(item, index) in tasks"
            :key="index"
            :position="item.position"
            @click="toggleInfoWindow(item, index)"
          >
          </Gmap-Marker>
          <gmap-info-window
            :options="infoOptions"
            :position="infoWindowPos"
            :opened="infoWinOpen"
            :clickable="true"
            @closeclick="infoWinOpen = false"
            ><div v-html="infoContent"></div>
          </gmap-info-window>
          <!-- <gmap-info-window
            :options="infoOptions"
            :position="infoWindowPos"
            :opened="infoWinOpen"
            @closeclick="infoWinOpen = false"
          >
            <div v-html="infoContent"></div>
          </gmap-info-window> -->
          <!-- <Gmap-Marker
            v-if="this.place"
            label="&#x2605;"
            :position="{
              lat: this.place.geometry.location.lat(),
              lng: this.place.geometry.location.lng(),
            }"
          ></Gmap-Marker> -->
        </Gmap-Map>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return {
      tasks: [],
      lists: [],
      place: null,
      currentLocation: { lat: 13, lng: 100 },
      lat: 0,
      lng: 0,
      // markers: [
      //   {
      //     position: {
      //       lat: 22.449769,
      //       lng: 0.3902178,
      //     },
      //   },
      // ],
      infoContent: '',
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
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

      console.log('result before set from API', result)
      this.lists = result[0]
      console.log('result from API', this.lists)

      const { result: details } = await this.$axios.$post(
        '/api/tasks/getAskForHelp'
      )
      console.log('data before set : ', details)
      this.tasks = details
      console.log('data after set : ', this.tasks[0].position)
    },
    moment(date) {
      return moment(date)
        .add('543', 'year', 'Asia/Bangkok')
        .locale('th')
        .format('LLLL')
    },

    geolocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
    toggleInfoWindow: function (item, idx) {
      this.infoWindowPos = item.position
      this.infoContent = this.getInfoWindowContent(item)

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    },

    getInfoWindowContent: function (item) {
      return `<div class="card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4 ma-0"><a href='/task/managetaskAll?id=${item.id}'>ข้อมูลผู้ป่วย</a></p>
                      <hr>
                    </div>
                  </div>
                  <div class="content">
                    ${item.name}
                    <br>
                    ${item.tel}
                    <br>
                    ${item.address_from_gmap}
                    <br>
                    <time datetime="2016-1-1" >${item.created_at}</time>
                  </div>
                </div>
              </div>`
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
  goToHelp(item) {
    // this.$router.push('/task/managetaskAll?id=' + data.id)
    console.log('data from InfoWindow ')
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
