<template>
  <div>
    <Tableadmin :headers="headers" :details="details" />
  </div>
</template>

<script>
import tableadmin from '../../components/tableadmin.vue'
export default {
  components: { tableadmin },
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
      console.log('tacecareuser',tasks)
      console.log('tacecareuser',headers)
    },
  },
}
</script>
