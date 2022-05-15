<template>
  <div>
    <h3>Test Chart</h3>
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  //   async fetch() {
  //     await this.fetchData()
  //   },
  data() {
    return {
      lists: [],
      series: [
        {
          name: 'High - 2013',
          data: [28, 29, 33, 36, 32, 32, 33],
        },
        {
          name: 'Low - 2013',
          data: [12, 11, 14, 18, 17, 13, 13],
        },
      ],
      chartOptions: {
        chart: {
          background: '#fff',
          fontFamily: 'Arial',
          height: 350,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth',
        },
        title: {
          text: 'Average High & Low Temperature',
          align: 'center',
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          title: {
            text: 'Month',
          },
        },
        yaxis: {
          title: {
            text: 'จำนวนผู้ขอความช่วยเหลือ',
          },
          min: 0,
          max: 50,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
    }
  },
  methods: {},
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
.apexcharts-canvas {
}
</style>
