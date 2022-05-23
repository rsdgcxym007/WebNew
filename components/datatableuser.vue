<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>
          ผู้ป่วยที่อยู่ในการแล
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
                  @change="onChangeStatus"
                ></v-select></v-col></v-row
          ></v-col>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="details"
          :items-per-page="5"
          :search="search"
          class="elevation-1"
          @click:row="editItem"
        >
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
          <template v-slot:[`item.created_at`]="{ item }">
            <div>
              {{ moment(item.created_at) }}
            </div>
          </template>
          <!-- <tamplate>
          <v-text-field>
            <v-slot>{{moment(data)}}</v-slot>
          </v-text-field>
        </tamplate> -->
          <template v-slot:[`item.level`]="{ item }">
            <v-chip :color="item.level" dark>
              <div v-if="item.level == 'green'">เขียว</div>
              <div v-if="item.level == 'yellow'">เหลือง</div>
              <div v-if="item.level == 'red'">แดง</div>
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022'
import tableadmin from './tableadmin.vue'
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
        'กำลังช่วยเหลือ',
        'ช่วยเหลือเสร็จสิ้น',
        'หายป่วยแล้ว',
      ],
    }
  },
  methods: {
    editItem(data) {
      this.$router.push('/task/managetaskAll?id=' + data.id)
    },
    // moment: function (date) {
    //   return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    // },
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
