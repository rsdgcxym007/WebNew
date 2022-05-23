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
      <v-col cols="12">
        <div id="chart">
          <br /><br />
          <div
            style="font-family: Prompt !important"
            class="black--text text-left text-h5"
          >
            จำนวนผู้ป่วยที่ขอความช่วยเหลือต่อวัน
          </div>
          <br />
          <div class="toolbar">
            <button
              id="one_month"
              @click="updateData('one_month')"
              :class="{ active: selection === 'one_month' }"
            >
              1เดือน
            </button>

            <button
              id="six_months"
              @click="updateData('six_months')"
              :class="{ active: selection === 'six_months' }"
            >
              6เดือน
            </button>

            <button
              id="one_year"
              @click="updateData('one_year')"
              :class="{ active: selection === 'one_year' }"
            >
              1ปี
            </button>
          </div>
          <br />
          <div id="chart-timeline">
            <apexchart
              type="bar"
              height="350"
              width="100%"
              ref="chart"
              :options="chartOptions"
              :series="datafrom"
            ></apexchart>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022'
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  async created() {
    console.log('create start')
    await this.getDataChart()
    console.log('create end')
    // this.timer = setInterval(this.loop, 10000)
  },
  data() {
    return {
      tasks: [],
      lists: [],
      datafrom: [
        {
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          background: 'white',
          height: 350,
          zoom: {
            autoScaleYaxis: true,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '70%',
              endingShape: 'rounded',
            },
          },
        },
        annotations: {
          yaxis: [
            {
              y: 5,
              min: 0,
              borderColor: '#999',
              // label: {
              //   show: true,
              //   showDuplicates: false,
              //   text: 'Total',
              //   style: {
              //     color: '#fff',
              //     background: '#00E396',
              //   },
              // },
              labels: {
                formatter: function (val) {
                  return parseInt(val) === val ? val : ''
                },
              },
            },
          ],
          xaxis: [
            {
              x: new Date('01 Apr 2022').getTime(),
              borderColor: '#999',
              yAxisIndex: 0,
              label: {
                show: true,
                text: 'Rally',
                style: {
                  color: '#fff',
                  background: '#775DD0',
                },
              },
            },
          ],
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          min: new Date('01 Apr 2022').getTime(),
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: 'dd MM yyyy',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },

      selection: 'one_year',
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
  mounted() {
    this.geolocation()
  },
  methods: {
    loop() {
      this.getDataChart()
    },
    async fetchData() {
      const result = await this.$axios.$get(
        'https://covid19.ddc.moph.go.th/api/Cases/today-cases-all'
      )

      console.log('result before set from API', result)
      this.lists = result[0]

      const { result: details } = await this.$axios.$post(
        '/api/tasks/getAskForHelp'
      )
      this.tasks = details
    },
    moment(date) {
      return moment(date)
        .add('543', 'year', 'Asia/Bangkok')
        .locale('Th')
        .format('DD/MM/YYYY,hh:mm a')
    },

    async getDataChart() {
      console.log('let1111')
      const { result } = await this.$axios.$post('/api/tasks/countByDay')
      console.log('data Fetch', result)
      const results = []
      result.forEach((e) => {
        results.push([e.date_request, parseInt(e.total_case)])
      })
      console.log('data for each', results)
      this.datafrom[0].data = results
      console.log('dataFrom', this.datafrom[0])
      console.log('dataSerieFrom', this.series)
      this.updateSeriesLine()
    },
    updateSeriesLine() {
      this.$refs.chart.updateSeries([
        {
          data: this.datafrom[0].data,
        },
      ])
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
      if (this.$auth.user.group_id === this.$constants.DATA.PATIENT_GROUP) {
        return `<div class="card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4 ma-0">ข้อมูลผู้ป่วย</p>
                      <hr>
                    </div>
                  </div>
                  <div class="content">
                  <br>
                    ${item.name}
                    <br>
                    ${item.tel}
                    <br>
                    ${item.address_from_gmap}
                    <br>
                    <time datetime="2016-1-1" >${item.created_at}</time>
                    <br>
                  </div>
                </div>
              </div>`
      } else {
        return `<div class="card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4 ma-0"><a href='/task/managetaskAll?id=${item.id}'>ข้อมูลผู้ป่วย</a></p>
                      <hr>
                    </div>
                  </div>
                  <div class="content">
                  <br>
                    ${item.name}
                    <br>
                    ${item.tel}
                    <br>
                    ${item.address_from_gmap}
                    <br>
                    <time datetime="2016-1-1" >${item.created_at}</time>
                    <br>
                    <br>
                    <p class="title is-2 ma-0"><a href='https://www.google.com/maps/search/?api=1&query=${item.position.lat},${item.position.lng}';>เปิดใน googlemap</a></p>
                  </div>
                </div>
              </div>`
      }
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
    updateData: function (timeline) {
      this.selection = timeline

      switch (timeline) {
        case 'one_month':
          this.$refs.chart.zoomX(
            new Date('01 Apr 2022').getTime(),
            new Date('01 May 2022').getTime()
          )
          break
        case 'six_months':
          this.$refs.chart.zoomX(
            new Date('01 Apr 2022').getTime(),
            new Date('01 Aug 2022').getTime()
          )
          break
        case 'one_year':
          this.$refs.chart.zoomX(
            new Date('01 Apr 2022').getTime(),
            new Date('01 Apr 2023').getTime()
          )
          break
        case 'ytd':
          this.$refs.chart.zoomX(
            new Date('01 Jan 2013').getTime(),
            new Date('27 Feb 2013').getTime()
          )
          break
        case 'all':
          this.$refs.chart.zoomX(
            new Date('23 Jan 2012').getTime(),
            new Date('27 Feb 2013').getTime()
          )
          break
        default:
      }
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '300'
        case 'sm':
          return '490'
        case 'md':
          return '500'
        case 'lg':
          return '500'
        case 'xl':
          return '600'
      }
      return ''
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
button#six_months,
button#one_month,
button#one_year {
  display: inline-block;
  padding: 1px 10px;
  margin: 1px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}
button#six_months:hover,
button#one_month:hover,
button#one_year:hover {
  background-color: #3e8e41;
}

button#six_months:active,
button#one_month:active,
button#one_year:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
</style>
