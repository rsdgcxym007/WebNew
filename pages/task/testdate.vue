<template>
  <div>
    <DatePicker v-model="selectedDate" :buddhist-year="buddhistYear" />
    <v-date-picker v-model="selectedDate" no-title @input="buddhistYear = false">
    </v-date-picker>
    <p>buddhist-year: {{ buddhistYear }}</p>
    <p>value: {{ selectedDate }}</p>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      selectedDate: this.$moment().format('DD-MM-YY'),
      // selectedDate: null,
      buddhistYear: true,
    }
  },
}
</script>

<style>
body {
  background-color: #aaaaaa;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
