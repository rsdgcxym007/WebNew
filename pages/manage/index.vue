<template>
  <div>
    <Datatable :headers="headers" :details="details" />
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
        '/api/manage/taskallbyuserid',
        { userId: this.$auth.user.id }
        
      )
      this.details = tasks
      this.headers = headers
    },
    request() {
      this.$router.push({ path: '/manage/request' })
    },
    async logout() {
      await this.$auth.logout()
      this.$router.push('/')
    },
  },
}
</script>
