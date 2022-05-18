<template>
  <div>
    <h3>Test Chart</h3>
    <v-btn @click="testconvert">TEST</v-btn>
    <div id="chart">
      <div class="toolbar">
        <button
          id="one_month"
          @click="updateData('one_month')"
          :class="{ active: selection === 'one_month' }"
        >
          1M
        </button>

        <button
          id="six_months"
          @click="updateData('six_months')"
          :class="{ active: selection === 'six_months' }"
        >
          6M
        </button>

        <button
          id="one_year"
          @click="updateData('one_year')"
          :class="{ active: selection === 'one_year' }"
        >
          1Y
        </button>

        <button
          id="ytd"
          @click="updateData('ytd')"
          :class="{ active: selection === 'ytd' }"
        >
          YTD
        </button>

        <button
          id="all"
          @click="updateData('all')"
          :class="{ active: selection === 'all' }"
        >
          ALL
        </button>
      </div>

      <div id="chart-timeline">
        <div id="chart">
          <apexchart
            type="bar"
            height="350"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  middleware: 'auth',
  //   async fetch() {
  //     await this.fetchData()
  //   },
  data() {
    return {
      lists: [],
      datafrom: [
        {
          data: [],
        },
      ],
      series: [
        {
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: [
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
          ],
        },
        yaxis: {
          title: {
            text: '$ (thousands)',
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$ ' + val + ' thousands'
            },
          },
        },
      },
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
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
      // const datatest = { first: 'a', second: 'b' }
      // const datatest2 = Object.values(datatest)

      // console.log('data test', datatest)
      // console.log('data test', datatest2)
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
    testconvert() {
      // const ts = moment('4/03/2022', 'M/D/YYYY').valueOf()
      // const m = moment(ts)
      // const s = m.format('DD/MM/YYYY')
      // console.log('Values are: ts = ' + ts + ', s = ' + s)
      const t1 = moment(1648918800000).format('YYYY-MMM-DD')
      const t2 = moment(1650387600000).format('YYYY-MMM-DD')
      const t3 = moment(1651165200000).format('YYYY-MMM-DD')
      const t4 = moment(1652288400000).format('YYYY-MMM-DD')
      const t5 = moment(1652461200000).format('YYYY-MMM-DD')
      const t6 = moment(1652547600000).format('YYYY-MMM-DD')

      console.log('date: ', t1)
      console.log('date: ', t2)
      console.log('date: ', t3)
      console.log('date: ', t4)
      console.log('date: ', t5)
      console.log('date: ', t6)
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
          return '500'
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
</style>
