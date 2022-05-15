<template>
  <v-container>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        อัพเดทอาการปัจจุบัน
        <v-spacer></v-spacer>
      </v-card-title>
      <v-form ref="form_remark" v-model="valid" lazy-validation class="px-4">
        <v-textarea
          v-model="taskData.remark"
          :rules="remarkRules"
          rows="3"
          no-resize
          label="อัพเดทอาการปัจจุบัน"
          outlined
          :disabled="checkStatus"
          required
        ></v-textarea>

        <v-col>
          <v-select
            v-model="taskData.status_id"
            item-text="text"
            item-value="id"
            class="my-2"
            :items="dropdown_icon"
            label="เลือกสถานะ"
            segmented
          ></v-select>
          <div v-if="taskData.status_id === $constants.DATA.HEALED_STATUS">
            <v-form ref="form_uploadImage" v-model="valid2">
              <v-row class="px-4">
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="hospital"
                    label="ชื่อสถานที่รักษา"
                    :rules="hospitalrules"
                    :disabled="checkStatus"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    :disabled="checkStatus"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Picker in menu"
                        readonly
                        :rules="hospitalrules"
                        v-bind="attrs"
                        v-on="on"
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" lg="6">
                  <div>
                    <label>ผลตรวจเชื้อแบบ RT-PCR</label>
                  </div>
                  <div v-if="imageRTPCR">
                    <img class="image1" :src="imageRTPCR" />
                  </div>
                  <div>
                    <v-col cols="6" class="pa-0">
                      <v-file-input
                        label="อัพโหลดรูปผล RT-PCR"
                        prepend-icon="mdi-camera"
                        accept="image/*"
                        :rules="hospitalrules"
                        @change="createImageRTPCR($event)"
                        :disabled="checkStatus"
                      ></v-file-input>
                    </v-col>
                  </div>
                </v-col>
                <v-col cols="12" lg="6">
                  <div>
                    <label>ใบรับรองแพทย์</label>
                  </div>
                  <div v-if="image_medicalcert">
                    <img class="image1" :src="image_medicalcert" />
                  </div>
                  <div>
                    <v-col cols="6" class="pa-0">
                      <v-file-input
                        label="อัพโหลดรูปใบรับรองแพทย์"
                        prepend-icon="mdi-camera"
                        accept="image/*"
                        :rules="hospitalrules"
                        @change="createcreateimage_medicalcert($event)"
                        :disabled="checkStatus"
                      ></v-file-input>
                    </v-col>
                  </div>
                </v-col>
              </v-row>
            </v-form>
            <br />
          </div>
          <div v-if="taskData.status_id === $constants.DATA.CANCEL_STATUS">
            <v-form ref="form_cancelDetail">
              <v-textarea
                v-model="taskData.cancel_detail"
                :rules="remarkRules"
                :disabled="checkStatus"
                rows="2"
                no-resize
                label="สาเหตุที่ยกเลิก"
                outlined
                required
              ></v-textarea>
            </v-form>
          </div>
          <v-col
            v-if="
              $store.state.taskInfo.status_id !==
                $constants.DATA.CANCEL_STATUS &&
              $store.state.taskInfo.status_id !== $constants.DATA.HEALED_STATUS
            "
            cols="12"
            class="px-0"
            style="text-align: end"
          >
            <v-btn :disabled="isReset" color="warning" @click="resetForm"
              >คืนค่า</v-btn
            >
            <v-btn
              :disabled="
                this.taskData.remark === this.$store.state.taskInfo.remark
              "
              color="success"
              @click="updateData()"
              >ยืนยัน</v-btn
            >
          </v-col>
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  async fetch() {
    await this.fetchData()
  },
  data() {
    return {
      valid: false,
      remarkRules: [(v) => !!v || 'is required'],
      taskData: {
        remark: '',
        id: '',
        status_id: '',
        cancel_detail: 'fs',
      },
      status: '',
      dropdown_icon: [
        { text: 'หายป่วยแล้ว', id: this.$constants.DATA.HEALED_STATUS },
      ],
      task: '',
      tasks: [],
      menu: false,
      valid2: true,
      date: '',
      hospital: '',
      imageRTPCR: '',
      image_medicalcert: '',
      remoteUrl: '',
      user_id: this.$auth.user.id,
      hospitalrules: [(v) => !!v || 'required'],
    }
  },
  methods: {
    async fetchData() {
      const result = await this.$axios.$get(
        'https://api.longdo.com/map/services/address?lon=100.53726&lat=13.72427&noelevation=1&key=19a82191e775c0fc9435aa5910727a3e'
      )
      console.log('result1:', result)
    },
    // async fetchData() {
    //   const { result: tasks } = await this.$axios.$post('/api/tasks/getbyId', {
    //     id: this.$route.query.id,
    //   })
    //   this.taskData = tasks
    //   this.$store.commit('SET_taskInfo', {
    //     taskInfo: {
    //       remark: this.taskData.remark,
    //       status_id: this.taskData.status_id,
    //     },
    //   })
    //   if (
    //     this.$store.state.taskInfo.status_id ==
    //     'ef9e2e70-d55b-4250-8967-965b7cb0cbc7'
    //   ) {
    //     const { result } = await this.$axios.$post('/api/tasks/getImage', {
    //       id: this.taskData.img_id,
    //     })
    //     console.log('data form Image: ', result)
    //     this.hospital = result.hospital
    //     this.date = result.day_of_visit
    //     this.imageRTPCR = result.image_rtpcr
    //     this.image_medicalcert = result.image_medical
    //   }
    //   if (this.taskData.status_id === '7c2f1759-f664-40d2-8184-c20f2e76c229') {
    //     this.dropdown_icon = [
    //       {
    //         text: 'ยกเลิก',
    //         id: '9fbd7f42-28da-41c1-8e03-3118fd9ab6ee',
    //       },
    //       {
    //         text: 'ขอความช่วยเหลือ',
    //         id: '7c2f1759-f664-40d2-8184-c20f2e76c229',
    //       },
    //     ]
    //   } else if (
    //     this.taskData.status_id === '490089af-cb09-476d-9568-a0896a50143a'
    //   ) {
    //     this.dropdown_icon = [
    //       {
    //         // '490089af-cb09-476d-9568-a0896a50143a' = กำลังช่วยเหลือ ใน DB
    //         text: 'กำลังได้รับการช่วยเหลือ',
    //         id: '490089af-cb09-476d-9568-a0896a50143a',
    //       },
    //       { text: 'หายป่วยแล้ว', id: 'ef9e2e70-d55b-4250-8967-965b7cb0cbc7' },
    //     ]
    //   } else if (
    //     this.taskData.status_id === '9fbd7f42-28da-41c1-8e03-3118fd9ab6ee'
    //   ) {
    //     this.dropdown_icon = [
    //       {
    //         text: 'ยกเลิก',
    //         id: '9fbd7f42-28da-41c1-8e03-3118fd9ab6ee',
    //       },
    //     ]
    //   }
    // },
    resetForm() {
      this.taskData.status_id = this.$store.state.taskInfo.status_id
      this.taskData.remark = this.$store.state.taskInfo.remark
      this.taskData.cancel_detail = ''
      this.hospital = ''
      this.date = ''
      this.imageRTPCR = ''
      this.image_medicalcert = ''
    },
    async updateData() {
      if (this.taskData.status_id === this.$constants.DATA.CANCEL_STATUS) {
        // if cancle
        await this.updateCanceldetail()
      } else if (
        this.taskData.status_id === this.$constants.DATA.ASK_FOR_HELP_STATUS ||
        this.taskData.status_id === this.$constants.DATA.HELPING_STATUS
      ) {
        //if just update remark
        await this.updateRemark()
      } else {
        await this.uploadImage()
      }
    },
    async updateCanceldetail() {
      this.$refs.form_remark.validate()
      this.$refs.form_cancelDetail.validate()
      if (
        this.$refs.form_remark.validate() &&
        this.$refs.form_cancelDetail.validate() === true
      ) {
        const { result, message } = await this.$axios.$post(
          // '/api/manage/updatetasks',
          // this.taskData
        )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
          })
          this.$router.push({ path: '/manage' })
        }
      } else {
        this.$swal({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน !',
          timer: 1500,
        })
      }
    },

    async updateRemark() {
      if (
        this.$refs.form_remark.validate() === true &&
        this.taskData.remark !== this.$store.state.taskInfo.remark
      ) {
        // const { result, message } = await this.$axios.$post(
        //   '/api/manage/update',
        //   this.taskData
        // )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
          })
          console.log('the last logging')
          this.$router.push({ path: '/manage' })
        }
      } else {
        this.$swal({
          icon: 'warning',
          title: 'กรุณาอัพเดทอาการปัจจุบัน !',
          timer: 1500,
        })
      }
    },
    async uploadImage() {
      if (
        this.$refs.form_remark.validate() === true &&
        this.$refs.form_uploadImage.validate() === true &&
        this.taskData.remark !== this.$store.state.taskInfo.remark
      ) {
        const data = {
          image_rtpcr: this.imageRTPCR,
          image_medical: this.image_medicalcert,
          hospital: this.hospital,
          day_of_visit: this.date,
          user_id: this.user_id,
          task_id: this.taskData.id,
          remark: this.taskData.remark,
          status_id: this.taskData.status_id,
        }
        await this.$axios.$post('/api/manage/uploadImage', { data })
        this.$swal.fire({
          type: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          showConfirmButton: false,
          timer: 1500,
        })
        this.$router.push({ path: '/manage' })
      } else {
        this.$swal({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน !',
          timer: 1500,
        })
      }
    },
    createImageRTPCR(pathFile) {
      if (pathFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageRTPCR = e.target.result
        }
        reader.readAsDataURL(pathFile)
      } else {
        this.imageRTPCR = ''
      }
    },
    createcreateimage_medicalcert(pathFile) {
      if (pathFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.image_medicalcert = e.target.result
        }
        reader.readAsDataURL(pathFile)
      } else {
        this.image_medicalcert = ''
      }
    },
    validate() {
      this.$refs.form.validate()
    },
    black() {
      this.$router.push({ path: '/manage' })
    },
    // async upload() {
    //   // var fileBuffer = Buffer.from(this.image1)
    //   // console.log('fileBuffer : ', fileBuffer)

    //   // console.log(this.image1.name)

    //   if (this.image1 && this.image2) {
    //     let formData = new FormData()
    //     formData.append('date', this.date)
    //     formData.append('file', this.image1)

    //     await this.$axios
    //       .$post(`/api/upload`, formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       })
    //       .then(async () => {
    //         let formData = new FormData()
    //         formData.append('file', this.image2)

    //         await this.$axios.$post(`/api/upload`, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data',
    //           },
    //         })
    //       })
    //   } else {
    //     console.log('error')
    //   }
    // },
  },
  computed: {
    isReset() {
      return (
        this.taskData.remark == this.$store.state.taskInfo.remark &&
        !this.taskData.cancel_detail &&
        !this.hospital &&
        !this.date &&
        !this.imageRTPCR &&
        !this.image_medical
      )
    },
    checkStatus() {
      // check for disabled lable when tasks gone complete
      if (
        this.$store.state.taskInfo.status_id ==
        this.$constants.DATA.HEALED_STATUS
      ) {
        return (
          this.$store.state.taskInfo.status_id ===
          this.$constants.DATA.HEALED_STATUS
        )
      } else if (
        this.$store.state.taskInfo.status_id ==
        this.$constants.DATA.CANCEL_STATUS
      ) {
        return (
          this.$store.state.taskInfo.status_id ===
          this.$constants.DATA.CANCEL_STATUS
        )
      }
    },
  },
}
</script>
<style scoped>
img.image1 {
  width: 100%;
  max-width: 300px;
  height: 100%;
}
</style>
