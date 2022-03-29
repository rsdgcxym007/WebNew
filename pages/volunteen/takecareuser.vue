<template>
  <div>
    <Datatableuser :headers="headers" :details="details" />
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return { details: [], headers: [], search: '' }
  },
  methods: {
    async fetchData() {
      const { result: tasks, headers } = await this.$axios.$post(
        '/api/volunteen/takecareuser',
        { userId: this.$auth.user.id }
      )
      this.details = tasks
      this.headers = headers
    },
  },
}
</script>
