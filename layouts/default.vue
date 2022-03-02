<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        class="d-none d-lg-block"
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn class="d-none d-lg-block" icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      <v-spacer />

      <v-menu offset-y :nudge-width="30">
        <template v-slot:activator="{ on, attrs }">
          <a v-bind="attrs" v-on="on">
            <v-avatar size="36" color="indigo">
              <v-icon dark> mdi-account-circle </v-icon>
            </v-avatar>
            {{ `${$auth.user.first_name} ${$auth.user.last_name}` }}
            <v-icon color="#1976d2">mdi-chevron-down</v-icon>
          </a>
        </template>
        <v-list>
          <v-list-item class="pointer">
            <v-list-item-icon>
              <v-icon>mdi-account-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>แก้ไขข้อมูลส่วนตัว</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pointer">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title @click="logout">ออกจากระบบ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-icon light> mdi-repeat </v-icon>
        <v-btn color="error" class="mb-6" @click="logout">ออกจากระบบ</v-btn>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items_user: [
        {
          icon: 'mdi-file-table',
          title: 'คำร้องขอ',
          to: '/manage',
        },
        {
          icon: 'mdi-map-marker',
          title: 'แผนที่',
          to: '/manage/map',
        },
        {
          icon: 'mdi-handshake',
          title: 'ขอความช่วย',
          to: '/manage/request',
        },
        {
          icon: 'mdi-note-edit',
          title: 'อัพเดทอาการเบื้องต้น',
          to: '/manage/update',
        },
        {
          icon: 'mdi-clipboard-check',
          title: 'ทำเรื่่องหายป่วย',
          to: '/manage/upcovid',
        },
      ],
      items_admin: [
        {
          icon: 'mdi-file-table',
          title: 'คำร้องขอ',
          to: '/manage',
        },
        {
          icon: 'mdi-map-marker',
          title: 'แผนที่',
          to: '/manage/map',
        },
        {
          icon: 'mdi-handshake',
          title: 'ขอความช่วย',
          to: '/manage/request',
        },
        {
          icon: 'mdi-note-edit',
          title: 'อัพเดทอาการเบื้องต้น',
          to: '/manage/update',
        },
        {
          icon: 'mdi-clipboard-check',
          title: 'ทำเรื่่องหายป่วย',
          to: '/manage/upcovid',
        },
        {
          icon: 'mdi-bell-circle',
          title: 'รายงาน',
          to: '/volunteen/report',
        },
        {
          icon: 'mdi-folder-account-outline',
          title: 'ผู้ป่วยที่อยู่ในการดูแล',
          to: '/volunteen/takecareuser',
        },
        {
          icon: 'mdi-archive-edit-outline',
          title: 'อัพเดพสถานนะผู้ป่วย',
          to: '/volunteen/updatestatus',
        },
        {
          icon: 'mdi-account-arrow-up-outline',
          title: 'ผู้ป่วยที่ขอความช่วยเหลือ',
          to: '/volunteen/userhelp',
        },
      ],
      items_volunteen: [
        {
          icon: 'mdi-map-marker',
          title: 'แผนที่',
          to: '/manage/map',
        },
        {
          icon: 'mdi-bell-circle',
          title: 'รายงาน',
          to: '/volunteen/report',
        },
        {
          icon: 'mdi-folder-account-outline',
          title: 'ผู้ป่วยที่อยู่ในการดูแล',
          to: '/volunteen/takecareuser',
        },
        {
          icon: 'mdi-archive-edit-outline',
          title: 'อัพเดพสถานนะผู้ป่วย',
          to: '/volunteen/updatestatus',
        },
        {
          icon: 'mdi-account-arrow-up-outline',
          title: 'ผู้ป่วยที่ขอความช่วยเหลือ',
          to: '/volunteen/userhelp',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      items: [],
    }
  },
  fetch() {
    console.log('this.$auth.user.profile_id : ', this.$auth.user.group_id)
    if (this.$auth.user.group_id === '51b0e763-1f09-416a-afa9-d2f0ce78e9e6') {
      this.items = this.items_user
    } else if (
      this.$auth.user.group_id === '87191711-d7ff-4664-b648-8e9bceaab5ea'
    ) {
      this.items = this.items_volunteen
    } else {
      this.items = this.items_admin
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/')
    },
  },
}
</script>
