<template>
  <v-container fluid>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        ทำเรื่องหายป่วย
      </v-card-title>
      <v-row class="px-4">
        <v-col cols="12" sm="6" md="12">
          <v-autocomplete
            v-model="task"
            :items="tasks"
            dense
            filled
            label="คำร้องขอ"
            outlined
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="12">
          <v-text-field
            v-model="hospital"
            label="ชือโรงพยาบาล"
            :rules="hospitalrules"
            required
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="12">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Picker in menu"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12">
          <div>
            <label>ผลตรวจเชื้อแบบ RT-PCR</label>
          </div>
          <div v-if="image1">
            <img :src="image1" width="300" height="100%" />
          </div>
          <div>
            <input @change="handleImage" type="file" accept="image/*" />
          </div>
        </v-col>
        <v-col cols="12">
          <div>
            <label>ใบรับรองแพทย์</label>
          </div>
          <div v-if="image2">
            <img :src="image2" width="300" height="100%" />
          </div>
          <div>
            <input @change="handleImage2" type="file" accept="image/*" />
          </div>
        </v-col>
        <v-col cols="12" style="text-align: end">
          <v-btn color="error" class="mr-4" @click="black"> ย้อนกลับ</v-btn>
          <v-btn
            :disabled="!valid"
            color="success"
            @click="uploadImage"
          >
            บันทึกข้อมูล
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      task: '',
      tasks: [],
      menu: false,
      valid: true,
      date: '',
      hospital: '',
      image1: '',
      image2: '',
      remoteUrl: '',
      user_id: this.$auth.user.id,
      hospitalrules: [(v) => !!v || 'required'],
    }
  },
  uploadImage() {
    if (this.$refs.form1.validate() === true) {
      this.onSubmit()
    } else {
      this.$swal({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        timer: 3000,
      })
    }
  },
  async fetch() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const { result: tasks } = await this.$axios.$post(
        '/api/tasks/getbyuser',
        { user_id: this.user_id }
      )

      this.tasks = tasks
    },
    handleImage(e) {
      const selectedImage = e.target.files[0] // get first file
      this.createBase64Image(selectedImage)
    },
    handleImage2(e) {
      const selectedImage = e.target.files[0] // get first file
      this.createBase64Image2(selectedImage)
    },
    createBase64Image(fileObject) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.image1 = e.target.result
        // this.uploadImage()
      }
      reader.readAsDataURL(fileObject)
    },
    createBase64Image2(fileObject) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.image2 = e.target.result
        // this.uploadImage()
      }
      reader.readAsDataURL(fileObject)
    },
    async uploadImage() {
      const { image1, image2, hospital, date, user_id, task } = this

      const data = {
        image_rtpcr: image1,
        image_medical: image2,
        hospital,
        day_of_visit: date,
        user_id,
        task,
        status: 'หายป่วยแล้ว',
      }

      await this.$axios.$post('/api/upload2', { data })
      this.$swal.fire({
        type: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      })
      this.$router.push({ path: '/manage' })

      // axios
      //   .post('http://127.0.0.1:8081/upload', { image })
      //   .then((response) => {
      //     this.remoteUrl = response.data.url
      //   })
      //   .catch((err) => {
      //     return new Error(err.message)
      //   })
    },
    async upload() {
      // var fileBuffer = Buffer.from(this.image1)
      // console.log('fileBuffer : ', fileBuffer)

      // console.log(this.image1.name)

      if (this.image1 && this.image2) {
        let formData = new FormData()
        formData.append('date', this.date)
        formData.append('file', this.image1)

        await this.$axios
          .$post(`/api/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(async () => {
            let formData = new FormData()
            formData.append('file', this.image2)

            await this.$axios.$post(`/api/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
          })
      } else {
        console.log('error')
      }
    },
    validate() {
      this.$refs.form.validate()
    },
    black() {
      this.$router.push({ path: '/manage' })
    },
  },
}
</script>
