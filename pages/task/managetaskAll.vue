<template>
  <v-container>
    <v-card elevation="8" class="mx-4 pa-4">
      <v-card-title>
        รายละเอียดการขอความช่วยเหลือ
        <v-spacer></v-spacer>
      </v-card-title>
      <!-- <v-form ref="form_managetask" lazy-validation class="px-4"> -->
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" :step="1" editable>
            ขอความช่วยเหลือ
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            :complete="e1 > 2"
            :step="2"
            :editable="
              taskData.status_id == $constants.DATA.HELPING_STATUS ||
              taskData.status_id == $constants.DATA.HELP_DONE_STATUS
            "
          >
            กำลังช่วยเหลือ
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            :complete="e1 > 3"
            :step="3"
            :editable="taskData.status_id == $constants.DATA.HELP_DONE_STATUS"
          >
            ช่วยเหลือเสร็จสิ้น
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form
              ref="form_request"
              lazy-validation
              v-model="validRequestForm"
            >
              <v-row class="px-4">
                <v-col cols="12">
                  <v-card-title class="pa-0">ตำแหน่งที่อยู่</v-card-title>
                  <v-switch
                    v-if="
                      $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    v-model="isOldAddress"
                    inset
                    label="ใช้ที่อยู่เดิม"
                  ></v-switch>
                </v-col>
                <v-col v-if="!isOldAddress" cols="9 " class="col-lg-11">
                  <gmap-autocomplete
                    placeholder="ค้นหาที่อยู่"
                    @place_changed="setPlace"
                    class="gsearch"
                  >
                  </gmap-autocomplete>
                </v-col>
                <v-col
                  v-if="!isOldAddress"
                  cols="3"
                  align-self="center"
                  class="col-lg-1 py-0 pl-0 pr-3 ma-0"
                >
                  <v-btn
                    block
                    color="primary"
                    @click="usePlace"
                    :disabled="isDisabledSearch"
                    >ค้นหา</v-btn
                  >
                </v-col>
                <v-col cols="12">
                  <Gmap-Map
                    style="width: 100%; height: 300px; margin: auto"
                    :zoom="zoom"
                    :center="center"
                    :options="{
                      zoomControl: true,
                      mapTypeControl: false,
                      scaleControl: false,
                      streetViewControl: true,
                      rotateControl: false,
                      fullscreenControl: true,
                      disableDefaultUi: false,
                    }"
                  >
                    <!-- <Gmap-Marker
                      v-for="(marker, index) in markers"
                      :key="index"
                      :position="marker.position"
                    ></Gmap-Marker> -->
                    <!-- <Gmap-Marker
                      v-if="this.place"
                      label="&#x2605;"
                      :position="{
                        lat: this.place.geometry.location.lat(),
                        lng: this.place.geometry.location.lng(),
                      }"
                    ></Gmap-Marker> -->
                    <Gmap-Marker
                      v-if="taskData.position"
                      :position="taskData.position"
                      :clickable="true"
                      :draggable="!isOldAddress"
                      @click="center = position"
                      @dragend="updatePosition"
                    ></Gmap-Marker>
                  </Gmap-Map>
                </v-col>
                <br />
                <v-col cols="12">
                  <v-textarea
                    v-model="taskData.address_from_gmap"
                    label="รายละเอียดที่อยู่จากหมุด"
                    rows="3"
                    :rules="rules.notNullRule"
                    no-resize
                    outlined
                    required
                    disabled
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="taskData.address_from_user"
                    label="รายละเอียดที่อยู่เพิ่มเติม"
                    rows="3"
                    no-resize
                    outlined
                    required
                    :disabled="isOldAddress"
                  ></v-textarea>
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" class="pt-0">
                  <v-card-title class="pa-0">ข้อมูลผู้ป่วย</v-card-title>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="taskData.user_firstname"
                    label="ขื่อ"
                    outlined
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="taskData.user_lastname"
                    label="นามสกุล"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="taskData.user_tel"
                    label="เบอร์โทร"
                    outlined
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <!-- <v-col cols="12" lg="6" class="pb-0">
                  <v-text-field label="วันเดือนปีเกิด" outlined disabled>
                  </v-text-field>
                </v-col> -->
                <v-col
                  v-if="
                    $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                    taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                  "
                  cols="12"
                  class="pt-0"
                  align="end"
                >
                  <nuxt-link to="/users" class="nav-link"
                    >แก้ไขข้อมูลส่วนตัว</nuxt-link
                  >
                </v-col>
                <v-col cols="12" class="pt-0">
                  <v-card-title class="pa-0"
                    >รายละเอียดการขอความช่วยเหลือ</v-card-title
                  >
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="taskData.congenital_disease"
                    :disabled="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP ||
                      this.taskData.status_id == $constants.DATA.CANCEL_STATUS
                    "
                    label="โรคประจำตัว"
                    :rules="rules.notNullRule"
                    no-resize
                    outlined
                    rows="2"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="selectedTypes"
                    label="ประเภทของความช่วยเหลือที่ต้องการ"
                    multiple
                    outlined
                    :rules="rules.selectRule"
                    :items="types"
                    :disabled="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP ||
                      taskData.status_id !== $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                  >
                    <template v-slot:prepend-item>
                      <v-list-item ripple @mousedown.prevent @click="toggle">
                        <v-list-item-action>
                          <v-icon
                            :color="
                              selectedTypes.length > 0 ? 'indigo darken-4' : ''
                            "
                          >
                            {{ icon }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title> เลือกทั้งหมด </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col
                  ><v-textarea
                    v-model="taskData.remark"
                    rows="3"
                    no-resize
                    label="อาการ"
                    outlined
                    required
                    :rules="rules.notNullRule"
                    :disabled="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP ||
                      taskData.status_id !== $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                  ></v-textarea
                ></v-col>
                <v-col
                  cols="12"
                  v-if="$auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP"
                >
                  <div style="font-weight: 500">ประเมินระดับอาการเบื้องต้น</div>
                  <v-radio-group
                    v-model="patient_group"
                    v-on:change="changePatientGroup"
                  >
                    <v-radio
                      label="กลุ่มสีเขียว (กลุ่มที่มีอาการเบาคล้ายไข้หวัด หรือไม่มีอาการเลย เช่น มีไข้ ไม่รับรส ไม่รับกลิ่น ไอ มีน้ำมูก เจ็บคอ ตาแดง มีผื่น และถ่ายเหลว)"
                      value="green"
                    ></v-radio>
                    <div v-if="patient_group == 'green'" class="pl-8">
                      <div style="color: rgba(0, 0, 0, 0.6); font-weight: 500">
                        สถานที่รักษา
                      </div>
                      <v-radio-group v-model="isolation" class="mt-0">
                        <v-radio
                          label="Home Isolation : การรักษาด้วยการกักตัวอยู่ที่บ้าน โดยจะได้รับการดูแลพร้อมอุปกรณ์ขั้นพื้นฐาน"
                          value="home"
                        ></v-radio>
                        <v-radio
                          label="Hospitel : ต้องใช้ใบยืนยันผลการตรวจแบบ RT-PCR"
                          value="hospitel"
                        ></v-radio
                      ></v-radio-group>
                    </div>
                    <v-radio
                      class="mt-4"
                      label="กลุ่มสีเหลือง (กลุ่มที่มีอาการเสี่ยงรุนแรง หรือมีโรคร่วม เช่น เวียนหัว อ่อนเพลีย ไอแล้วมีอาการเหนื่อย แน่นหน้าอก หายใจลำบาก ขับถ่ายเหลว 3 ครั้งต่อวันขึ้นไป อ่อนเพลีย ปอดอักเสบ)"
                      value="yellow"
                    ></v-radio>
                    <div v-if="patient_group == 'yellow'" class="pl-8">
                      <div style="color: rgba(0, 0, 0, 0.6); font-weight: 500">
                        สถานที่รักษาที่ต้องการ
                      </div>
                      <v-radio-group v-model="isolation" class="mt-0">
                        <v-radio label="โรงพยาบาล" value="hospital"></v-radio
                      ></v-radio-group>
                    </div>
                    <v-radio
                      class="mt-4"
                      label="กลุ่มสีแดง (กลุ่มที่มีอาการรุนแรงต้องรีบเข้ารับการรักษาตัวโดยเร็ว เช่น ระบบหายใจมีปัญหารุนแรงทำให้หายใจลำบาก หอบเหนื่อย หากเอกซเรย์จะพบปอดอักเสบรุนแรง แน่นหน้าอกตลอดเวลา และหายใจเจ็บหน้าอก ตอบสนองช้า หรือไม่รู้สึกตัว)"
                      value="red"
                    ></v-radio>
                    <div v-if="patient_group == 'red'" class="pl-8">
                      <div style="color: rgba(0, 0, 0, 0.6); font-weight: 500">
                        สถานที่รักษาที่ต้องการ
                      </div>
                      <v-radio-group v-model="isolation" class="mt-0">
                        <v-radio label="โรงพยาบาล" value="hospital"></v-radio
                      ></v-radio-group>
                    </div>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" class="mb-4" style="text-align: end">
                  <v-row>
                    <v-col cols="12" class="ma-0 pr-0" style="text-align: end">
                      <v-btn
                        v-if="
                          $auth.user.group_id ==
                            $constants.DATA.PATIENT_GROUP &&
                          taskData.status_id ==
                            $constants.DATA.ASK_FOR_HELP_STATUS
                        "
                        :disabled="isReset"
                        color="warning"
                        class="mr-4"
                        @click="resetForm"
                      >
                        คืนค่า
                      </v-btn>
                      <v-btn
                        v-if="
                          $auth.user.group_id ==
                            $constants.DATA.PATIENT_GROUP &&
                          taskData.status_id ==
                            $constants.DATA.ASK_FOR_HELP_STATUS
                        "
                        color="success"
                        class="mr-3"
                        @click="saveEdit"
                        :disabled="isSaveEdit"
                      >
                        บันทึกการแก้ไข
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row
                    justify="end"
                    class="mr-0 pt-1"
                    v-if="
                      $auth.user.group_id == $constants.DATA.PATIENT_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                  >
                    <v-dialog v-model="dialog" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn color="error" dark v-bind="attrs" v-on="on">
                          Cancel Task
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>สาเหตุที่ยกเลิก </v-card-title>
                        <v-card-text class="pb-0">
                          <v-container>
                            <v-row>
                              <v-col>
                                <v-textarea
                                  v-model="taskData.cancel_detail"
                                  rows="5"
                                  no-resize
                                  label="รายละเอียด"
                                  outlined
                                  required
                                ></v-textarea>
                              </v-col>
                            </v-row>
                            <!-- <v-row>
                              <v-col style="text-align: end">
                                <v-btn
                                  class="pr-5"
                                  color="success"
                                  @click="cancelTask"
                                >
                                  Save
                                </v-btn>
                              </v-col>
                            </v-row> -->
                          </v-container>
                        </v-card-text>
                        <v-card-actions class="pt-0">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="closeDialog"
                          >
                            Close
                          </v-btn>
                          <v-btn
                            class="pr-5"
                            color="blue darken-1"
                            text
                            @click="cancelTask"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-row>
                  <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                      taskData.status_id == $constants.DATA.ASK_FOR_HELP_STATUS
                    "
                    color="primary"
                    @click="updateData()"
                  >
                    เข้าช่วยเหลือ
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-row class="px-4">
              <v-col cols="12">
                <v-card-title class="pa-0">อาสาสมัครผู้ดำเนินการ</v-card-title>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  label="ขื่อ"
                  v-model="taskData.volunteer_firstname"
                  outlined
                  disabled
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  label="นามสกุล"
                  v-model="taskData.volunteer_lastname"
                  outlined
                  disabled
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  label="เบอร์โทร"
                  v-model="taskData.volunteer_tel"
                  outlined
                  disabled
                >
                </v-text-field>
              </v-col>
              <v-col
                v-if="
                  $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                  taskData.status_id == $constants.DATA.HELPING_STATUS
                "
                cols="12"
                class="pt-0"
                align="end"
              >
                <nuxt-link to="/users" class="nav-link"
                  >แก้ไขข้อมูลส่วนตัว</nuxt-link
                >
              </v-col>
              <!-- <v-col cols="12">
                  <v-card-title class="pa-0"
                    >รายละเอียดการช่วยเหลือ</v-card-title
                  >
                </v-col> -->
              <!-- <v-col cols="12">
                  <table class="table" style="width: 100%">
                    <thead>
                      <tr>
                        <td>วันที่</td>
                        <td class="pl-3">รายละเอียดการช่วยเหลือ</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td>
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </td>
                        <td>
                          <v-text-field
                            v-model="item.description"
                            label="รายละเอียด"
                            outlined
                            class="ml-3"
                          >
                          </v-text-field>
                        </td>
                        <td style="text-align: right">
                          <v-btn
                            v-on:click="addItem"
                            v-if="items.length - 1 <= index"
                            v-bind:class="{
                              disabled:
                                item.title.length == 0 ||
                                item.description.length == 0,
                            }"
                            color="success"
                            class="mr-3"
                            style="margin-top: -32px"
                          >
                            เพิ่ม
                          </v-btn>
                          <v-btn
                            v-on:click="removeItem(index)"
                            v-if="
                              items.length - 1 >= index &&
                              items.length - 1 != index
                            "
                            color="error"
                            style="margin-top: -32px; margin-right: 12px"
                          >
                            ลบ
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-col> -->
              <!-- <v-col
                  v-if="
                    $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                    taskData.status_id == $constants.DATA.HELPING_STATUS
                  "
                  cols="12"
                  class="pt-0"
                  align="end"
                >
                  <nuxt-link to="/users" class="nav-link"
                    >บันทึกรายละเอียดการช่วยเหลือ</nuxt-link
                  >
                  <v-divider class="mt-2"></v-divider>
                </v-col> -->

              <v-col cols="12" class="mb-4" style="text-align: end">
                <!-- <v-btn
                    v-if="
                      $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                      taskData.status_id == $constants.DATA.HELPING_STATUS
                    "
                    color="warning"
                    class="mr-3"
                  >
                    บันทึกข้อมูล
                  </v-btn> -->
                <v-btn
                  v-if="
                    $auth.user.group_id == $constants.DATA.VOLUNTEER_GROUP &&
                    taskData.status_id == $constants.DATA.HELPING_STATUS
                  "
                  color="primary"
                  @click="updateData()"
                >
                  ช่วยเหลือเสร็จสิ้น
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-row class="px-4">
              <v-col cols="12">
                <v-card-title class="pa-0"
                  >อัพโหลดข้อมูลการรักษา</v-card-title
                ></v-col
              >
              <!-- <v-col cols="12">
                  <v-textarea
                    rows="3"
                    no-resize
                    label="หมายเหตุ"
                    outlined
                    required
                  ></v-textarea
                ></v-col> -->
              <v-col cols="12">
                <v-form ref="form_uploadImage" v-model="valid2">
                  <v-row class="px-4">
                    <v-col cols="12" lg="6">
                      <v-text-field
                        v-model="hospital"
                        label="ชื่อสถานที่รักษา"
                        :rules="rules.notNullRule"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="endDate"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="endDate"
                            label="วันที่หาย"
                            readonly
                            :rules="rules.notNullRule"
                            v-bind="attrs"
                            v-on="on"
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="endDate" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(endDate)"
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
                      <div v-if="imageRtpcr">
                        <img class="image" :src="imageRtpcr" />
                      </div>
                      <div>
                        <v-col cols="6" class="pa-0">
                          <v-file-input
                            label="อัพโหลดรูปผล RT-PCR"
                            prepend-icon="mdi-camera"
                            accept="image/*"
                            :rules="rules.notNullRule"
                            @change="createImageRtpcr($event)"
                          ></v-file-input>
                        </v-col>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <div>
                        <label>ใบรับรองแพทย์</label>
                      </div>
                      <div v-if="imageMedicalCert">
                        <img class="image" :src="imageMedicalCert" />
                      </div>
                      <div>
                        <v-col cols="6" class="pa-0">
                          <v-file-input
                            label="อัพโหลดรูปใบรับรองแพทย์"
                            prepend-icon="mdi-camera"
                            accept="image/*"
                            :rules="rules.notNullRule"
                            @change="createImageMedicalCert($event)"
                          ></v-file-input>
                        </v-col>
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
              <v-col cols="12" class="mb-4" style="text-align: end">
                <v-btn color="primary" @click="submit" :disabled="!valid2">
                  เสร็จสิ้น
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <!-- </v-form> -->
    </v-card>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      center: { lat: 13.736717, lng: 100.523186 },
      currentLocation: { lat: 13, lng: 100 },
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),

      dialog: false,
      e1: 1,
      endDate: '',
      hospital: '',
      isOldAddress: true,
      isolation: '',
      image1: '',
      image2: '',
      imageRtpcr: '',
      imageMedicalCert: '',
      items: [
        {
          title: '',
          description: '',
        },
      ],
      lat: 0,
      lng: 0,
      markers: [],
      menu: false,
      menu2: false,
      modal: false,
      patient_group: '',
      place: null,
      rules: {
        notNullRule: [(v) => !!v || 'required'],
        selectRule: [(v) => v.length > 0 || 'required'],
      },
      selectedTypes: [],
      steps: 4,
      taskData: {
        remark: '',
        id: '',
        status_id: '',
        cancel_detail: '',
        volunteer_id: '',
        volunteer_firstname: '',
        volunteer_lastname: '',
        volunteer_tel: '',
        user_firstname: '',
        user_lastname: '',
        user_tel: '',
        position: null,
        address_from_user: '',
        address_from_gmap: '',
        address_id: '',
        requirement: [],
        congenital_disease: '',
      },
      types: ['สถานที่รักษา', 'อาหาร / ยา / ของใช้', 'รถรับส่ง'],
      validRequestForm: '',
      valid2: '',
      zoom: 12,
    }
  },

  async mounted() {
    this.geolocation()
    await this.fetchData()
  },

  computed: {
    likesAllFruit() {
      return this.selectedTypes.length === this.types.length
    },
    likesSomeFruit() {
      return this.selectedTypes.length > 0 && !this.likesAllFruit
    },
    icon() {
      console.log('icon')

      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    isDisableAddress() {
      return this.$auth.user.group_id == this.$constants.DATA.VOLUNTEER_GROUP
    },
    isDisabledSearch() {
      return !this.place
    },
    isSaveEdit() {
      return (
        (this.taskData.remark === this.$store.state.taskInfo.remark &&
          this.taskData.position === this.$store.state.taskInfo.position &&
          this.taskData.remark === this.$store.state.taskInfo.remark &&
          this.taskData.congenital_disease ===
            this.$store.state.taskInfo.congenital_disease &&
          this.selectedTypes === this.$store.state.taskInfo.requirement) ||
        !this.validRequestForm
      )
    },
    isReset() {
      return (
        this.isOldAddress &&
        this.taskData.congenital_disease ===
          this.$store.state.taskInfo.congenital_disease &&
        this.selectedTypes === this.$store.state.taskInfo.requirement &&
        this.taskData.remark === this.$store.state.taskInfo.remark
      )
    },
  },

  watch: {
    steps(val) {
      console.log('value Steps: ', val)
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    isOldAddress(newValue) {
      console.log(newValue)
      if (newValue == true) {
        const taskInfo = this.$store.state.taskInfo

        this.taskData.position = taskInfo.position
        this.taskData.address_from_gmap = taskInfo.address_from_gmap
        this.taskData.address_from_user = taskInfo.address_from_user
        this.center = taskInfo.position
        this.address_id = taskInfo.address_id
        this.zoom = 16
      } else {
        this.taskData.position = null
        this.taskData.address_from_gmap = ''
        this.taskData.address_from_user = ''
        this.center = { lat: 13.736717, lng: 100.523186 }
        this.zoom = 10
      }
    },
  },

  methods: {
    async fetchData() {
      console.log('fetch task from para id')
      const { result: tasks } = await this.$axios.$post('/api/tasks/getbyId', {
        id: this.$route.query.id,
      })
      this.taskData = tasks
      this.center = this.taskData.position
      // if (this.taskData.volunteer_id) {
      //   const { result } = await this.$axios.$post('/api/user/getbyID', {
      //     id: this.taskData.volunteer_id,
      //   })
      //   if (result) {
      //     this.taskData.volunteer_firstname = result.first_name
      //     this.taskData.volunteer_lastname = result.last_name
      //     this.taskData.volunteer_tel = result.tel
      //   }
      // }
      if (this.taskData.status_id == this.$constants.DATA.ASK_FOR_HELP_STATUS) {
        this.e1 = 1
      } else if (
        this.taskData.status_id == this.$constants.DATA.HELPING_STATUS
      ) {
        this.e1 = 2
      } else if (
        this.taskData.status_id == this.$constants.DATA.HELP_DONE_STATUS
      ) {
        this.e1 = 3
      }

      this.$store.commit('SET_taskInfo', {
        taskInfo: {
          remark: this.taskData.remark,
          status_id: this.taskData.status_id,
          cancel_detail: this.taskData.cancel_detail,
          position: this.taskData.position,
          address_from_gmap: this.taskData.address_from_gmap,
          address_from_user: this.taskData.address_from_user,
          address_id: this.taskData.address_id,
          requirement: this.taskData.requirement,
          patient_group: this.taskData.level,
          isolation: this.taskData.treatment_location,
          congenital_disease: this.taskData.congenital_disease,
        },
      })
      this.selectedTypes = this.$store.state.taskInfo.requirement
      this.patient_group = this.taskData.level
      this.isolation = this.taskData.treatment_location
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedTypes = []
        } else {
          this.selectedTypes = this.types.slice()
        }
      })
    },
    closeDialog() {
      this.dialog = false
      this.taskData.cancel_detail = ''
    },
    changePatientGroup() {
      if (this.patient_group == 'green') {
        this.isolation = 'home'
      } else {
        this.isolation = 'hospital'
      }
    },
    createImageRtpcr(pathFile) {
      if (pathFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageRtpcr = e.target.result
        }
        reader.readAsDataURL(pathFile)
      } else {
        this.imageRtpcr = ''
      }
    },
    createImageMedicalCert(pathFile) {
      if (pathFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageMedicalCert = e.target.result
        }
        reader.readAsDataURL(pathFile)
      } else {
        this.imageMedicalCert = ''
      }
    },
    // nextStep(n) {
    //   if (n === this.steps) {
    //     this.e1 = 1
    //   } else {
    //     this.e1 = n + 1
    //   }
    // },
    async submit() {
      const data = {
        image_rtpcr: this.imageRtpcr,
        image_medical: this.imageMedicalCert,
        hospital: this.hospital,
        day_of_visit: this.endDate,
        user_id: this.taskData.user_id,
        task_id: this.taskData.id,
        status_id: 'ef9e2e70-d55b-4250-8967-965b7cb0cbc7',
      }
      console.log('data for sent', data)
      await this.$axios.$post('/api/uploadimages/create', { data })
      this.$swal.fire({
        type: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      })
      this.$router.push({ path: '/manage' })
    },
    async cancelTask() {
      const { result, message } = await this.$axios.$post('/api/task/update', {
        id: this.taskData.id,
        status_id: this.$constants.DATA.CANCEL_STATUS,
        cancel_detail: this.taskData.cancel_detail,
      })
      if (!result) {
        console.log('errer: ', message)
      } else {
        this.$router.push('/manage')
      }
    },
    async resetForm() {
      const taskInfo = await this.$store.state.taskInfo

      this.selectedTypes = taskInfo.requirement
      this.taskData.remark = taskInfo.remark
      this.taskData.congenital_disease = taskInfo.congenital_disease
      this.isOldAddress = true
    },
    async saveEdit() {
      if (this.taskData.position === this.$store.state.taskInfo.position) {
        console.log('save with out update address')
        const { result, message } = await this.$axios.$post(
          '/api/task/update',
          {
            id: this.taskData.id,
            remark: this.taskData.remark,
            requirement: this.selectedTypes,
            congenital_disease: this.taskData.congenital_disease,
          }
        )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
            showConfirmButton: false,
            timer: 500,
          })
          await this.fetchData()
        }
      } else {
        console.log('save with update address')
        const { result, message } = await this.$axios.$post(
          '/api/task/update',
          {
            id: this.taskData.id,
            address_id: this.taskData.address_id,
            position: this.taskData.position,
            address_from_user: this.taskData.address_from_user,
            address_from_gmap: this.taskData.address_from_gmap,
            remark: this.taskData.remark,
            requirement: this.selectedTypes,
          }
        )
        if (!result) {
          console.log('error : ', message)
        } else {
          this.$swal({
            type: 'success',
            title: message,
            timer: 1500,
          })

          await this.fetchData()
        }
      }
    },
    async updateData() {
      if (
        this.taskData.status_id === this.$constants.DATA.ASK_FOR_HELP_STATUS
      ) {
        await this.updateHelping()
      } else if (
        this.taskData.status_id === this.$constants.DATA.HELPING_STATUS
      ) {
        await this.updateHelpDone()
      }
      // else if (
      //   this.taskData.status_id === '7c2f1759-f664-40d2-8184-c20f2e76c229' ||
      //   this.taskData.status_id === '490089af-cb09-476d-9568-a0896a50143a'
      // ) {
      //   //if just update remark
      //   await this.updateRemark()
      // } else {
      //   await this.uploadImage()
      // }
    },
    async updateHelping() {
      if (!this.patient_group || !this.isolation) {
        this.$swal({
          type: 'warning',
          title: 'กรุณาประเมินอาการผู้ป่วย',
        })
        return false
      }
      const { result, message } = await this.$axios.$post('/api/task/update', {
        id: this.taskData.id,
        status_id: this.$constants.DATA.HELPING_STATUS,
        volunteer_id: this.$auth.user.id,
        level: this.patient_group,
        treatment_location: this.isolation,
      })
      if (!result) {
        console.log('error : ', message)
      } else {
        await this.fetchData()
      }
    },
    async updateHelpDone() {
      const { result, message } = await this.$axios.$post('/api/task/update', {
        id: this.taskData.id,
        status_id: this.$constants.DATA.HELP_DONE_STATUS,
      })
      if (!result) {
        console.log('error : ', message)
      } else {
        await this.fetchData()
      }
    },
    geolocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
    setDescription(description) {
      this.description = description
    },

    setPlace(place) {
      this.place = place
      console.log('current place', this.place)
      console.log('lat from place: ', place.geometry.location.lat())
      console.log('lat from place: ', place.geometry.location.lng())
    },

    usePlace() {
      if (this.place) {
        this.taskData.position = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }
        console.log('latlng from usePlace: ', this.taskData.position)
        console.log('latlng from usePlace: ', this.place.formatted_address)

        this.taskData.address_from_gmap = this.place.formatted_address
        this.zoom = 18
        this.center = this.taskData.position
        this.place = null
      }
    },
    updatePosition(location) {
      console.log('location after update: ', location)
      this.taskData.position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      }
      console.log('location: ', this.position)
      this.getAddressDetail(
        this.taskData.position.lat,
        this.taskData.position.lng
      )
    },

    async getAddressDetail(lat, lng) {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat, lng }

      await geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          console.log('result from getTown', results[0])
          this.taskData.address_from_gmap = results[0].formatted_address
        } else {
          console.log('No results found')
        }
      })
    },
    addItem: function () {
      this.items.push({
        title: '',
        description: '',
      })
    },
    removeItem: function (index) {
      this.items.splice(index, 1)
    },
  },
}
</script>
<style scoped>
.gsearch {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  max-height: 56px;
  flex: 1 1 auto;
  line-height: 20px;
  padding: 16px 8px;
  max-width: 100%;
  min-width: 0px;
  width: 100%;
}

img.image {
  width: 100%;
  max-width: 300px;
  height: 100%;
}
</style>