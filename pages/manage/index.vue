<template>
  <div>
    <Datatable
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
        '/api/tasks/getAllByUserId',
        { userId: this.$auth.user.id, statusName: this.statusName }
      )
      this.details = tasks
      this.headers = headers
    },
    nex_txt(txt) {
      txt.substr(0, 15) + '...'
    },
    request() {
      this.$router.push({ path: '/manage/request' })
    },
    async logout() {
      await this.$auth.logout()
      this.$router.push('/')
    },
    onChangeStatus(val) {
      console.log('change', val)
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
