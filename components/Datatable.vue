<template>
  <div>
    <v-container>
      <v-card elevation="8" class="mx-4">
        <v-card-title>
          รายการคำร้องขอ
          <v-spacer></v-spacer>
          <v-col cols="6">
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="ค้นหา"
                ></v-text-field
              ></v-col>
              <v-col cols="4"
                ><v-select
                  v-model="status"
                  class="ml-4"
                  :items="statusItems"
                  label="สถานะ"
                  @change="onChangeStatus($event)"
                ></v-select></v-col></v-row
          ></v-col>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="details"
          :items-per-page="5"
          :search="search"
          class="elevation-1 px-2"
          @click:row="editItem"
        >
          <template v-slot:[`item.created_at`]="{ item }">
            <div>
              {{ moment(item.created_at) }}
            </div>
          </template>
          <template v-slot:[`item.status_name`]="{ item }">
            <v-chip dark :color="item.color">
              {{ item.status_name }}
            </v-chip>
          </template>
          <template v-slot:[`item.address`]="{ item }">
            <div class="a">{{ item.address }}.</div>
          </template>
          <template v-slot:[`item.remark`]="{ item }">
            <div class="a">{{ item.remark }}.</div>
          </template>
          <template v-slot:[`item.warning`]="{ item }">
            <span v-if="item.status_name == 'หายป่วยแล้ว'">
              <v-icon>mdi-alert-outline</v-icon>กรุณาอัพโหลดเอกสารการรักษา</span
            >
            <!-- <span v-else-if="item.status_name == 'ช่วยเหลือเสร็จสิ้น'"
              ><v-icon>mdi-alert-outline</v-icon>อัพโหลดเอกสารแล้ว</span
            > -->
            <span v-else>-</span></template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022'
export default {
  props: {
    headers: {
      type: Array,
      default: [],
    },
    details: {
      type: Array,
      default: [],
    },
    onChangeStatus: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      status: 'ทั้งหมด',
      search: '',
      statusItems: [
        'ทั้งหมด',
        'ขอความช่วยเหลือ',
        'กำลังช่วยเหลือ',
        'ช่วยเหลือเสร็จสิ้น',
        'หายป่วยแล้ว',
      ],
    }
  },
  methods: {
    editItem(data) {
      this.$router.push('/task/managetaskAll?id=' + data.id)
      // this.$router.push('/manage/update?id=' + data.id)
    },
    moment(date) {
      return moment(date).add('543', 'year').format('DD/MM/YYYY,hh:mm a')
    },
  },
}
</script>
<style scoped>
div.a {
  white-space: nowrap;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

div.a:hover {
  overflow: visible;
}
</style>
