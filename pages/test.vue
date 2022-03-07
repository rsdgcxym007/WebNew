<template>
    <div>test</div>
</template>
<script>
export default {
  data() {
    return {
      search: ''
    }
  },
  async fetch() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const result = await this.$axios.$get(
        'https://covid19.ddc.moph.go.th/api/Cases/today-cases-all'
      )
      console.log('result1:', result)
      console.log('result2:', result[0].new_case)
    },
  },
}
</script>