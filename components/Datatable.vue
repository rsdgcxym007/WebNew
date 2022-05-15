<template>
  <div>
    <v-container>
      <v-card elevation="8" class="mx-4">
        <v-card-title>
          รายการคำร้องขอ
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="ค้นหา"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="details"
          :items-per-page="5"
          :search="search"
          class="elevation-1 px-2"
          @click:row="editItem"
        >
          <template v-slot:[`item.status_name`]="{ item }">
            <v-chip dark :color="item.color">
              {{ item.status_name }}
            </v-chip>
          </template>
          <template v-slot:[`item.warning`]="{ item }">
            <span v-if="item.status_name == 'ช่วยเหลือเสร็จสิ้น'">
              <v-icon>mdi-alert-outline</v-icon>กรุณาอัพโหลดเอกสารการรักษา</span
            >
            <span v-else>-</span></template
          >
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ['headers', 'details'],
  data() {
    return {
      search: '',
    }
  },
  methods: {
    editItem(data) {
      this.$router.push('/task/managetaskAll?id=' + data.id)
      // this.$router.push('/manage/update?id=' + data.id)
    },
  },
}
</script>
