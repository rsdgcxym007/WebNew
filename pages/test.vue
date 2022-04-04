<template>
  <div>
    <b-card-group deck>
      <b-card
        bg-variant="primary"
        text-variant="white"
        header="Primary"
        class="text-center"
      >
        <b-card-text
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text
        >
      </b-card>

      <b-card
        bg-variant="secondary"
        text-variant="white"
        header="Secondary"
        class="text-center"
      >
        <b-card-text
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text
        >
      </b-card>

      <b-card
        bg-variant="success"
        text-variant="white"
        header="Success"
        class="text-center"
      >
        <b-card-text
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text
        >
      </b-card>
    </b-card-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: '',
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
