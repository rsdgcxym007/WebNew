<template>
  <div>
    <Datatableuser
      :headers="headers"
      :details="details"
      :onChangeStatus="onChangeStatus"
    />
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return { details: [], headers: [], search: '', statusName: '' }
  },
  methods: {
    async fetchData() {
      const { result: tasks, headers } = await this.$axios.$post(
        '/api/volunteen/takecareuser',
        { userId: this.$auth.user.id, statusName: this.statusName }
      )
      this.details = tasks
      this.headers = headers
      console.log('takecareuser', tasks)
    },
    onChangeStatus(val) {
      if (val == 'ทั้งหมด') {
        this.statusName = ''
      } else {
        this.statusName = val
      }
      this.fetchData()
    },
  },
}
</script>
