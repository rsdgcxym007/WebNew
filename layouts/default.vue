<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="deep-purple accent-4"
      dark
    >
      <v-list-item class="px-2 py-1">
        <v-list-item-avatar>
          <v-img :src="require('../assets/images/virus19.png')"></v-img>
        </v-list-item-avatar>
        <v-list-item-title>Covid 19</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>
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
      <!-- <v-btn class="d-none d-lg-block" icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      <v-spacer />

      <!-- <v-menu offset-y :nudge-width="30">
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
      </v-menu> -->
      <v-btn class="ml-2" min-width="0" text to="/dashboard" exact>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
      <v-menu
        bottom
        left
        min-width="200"
        offset-y
        origin="top right"
        transition="scale-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
            <v-card-text>{{ $store.state.userInfo.first_name }} </v-card-text>
            <!-- <v-card-text>{{$auth.user.first_name }} </v-card-text> -->
          </v-btn>
        </template>

        <v-list>
          <!-- <v-hover v-slot:default="{ hover }"> -->
          <v-list-item class="pointer tile">
            <!-- <v-list-item-icon>
                <v-icon :dark="hover">mdi-account-edit</v-icon>
              </v-list-item-icon> -->
            <v-list-item-content>
              <v-list-item-title @click="goToUserpage"
                >แก้ไขข้อมูลส่วนตัว</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <!-- </v-hover> -->
          <!-- <v-hover v-slot:default="{ hover }"> -->
          <v-list-item class="pointer title-logout">
            <!-- <v-list-item-icon>
                <v-icon :dark="hover">mdi-logout</v-icon>
              </v-list-item-icon> -->
            <v-list-item-content>
              <v-list-item-title @click="logout">ออกจากระบบ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- </v-hover> -->
        </v-list>
      </v-menu>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main class="bg-purple">
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
    <v-footer :absolute="!fixed" app elevation="12">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'default',
  data() {
    return {
      user_login: { id: '', first_name: '' },
      clipped: false,
      drawer: true,
      fixed: false,
      items_user: [
        {
          icon: 'mdi-file-table',
          title: 'คำร้องขอ',
          to: '/manage',
        },
        // {
        //   icon: 'mdi-map-marker',
        //   title: 'แผนที่',
        //   to: '/manage/map',
        // },
        {
          icon: 'mdi-handshake',
          title: 'ขอความช่วย',
          to: '/manage/request',
        },
        // {
        //   icon: 'mdi-note-edit',
        //   title: 'อัพเดทอาการเบื้องต้น',
        //   to: '/manage/update',
        // },
        // {
        //   icon: 'mdi-clipboard-check',
        //   title: 'ทำเรื่่องหายป่วย',
        //   to: '/manage/upcovid',
        // },
      ],
      items_admin: [
        {
          icon: 'mdi-map-marker',
          title: 'หน้าแรก',
          to: '/admin/indexadmin',
        },
      ],
      items_volunteen: [
        {
          icon: 'mdi-map-marker',
          title: 'หน้าแรก',
          to: '/dashboard',
        },
        // {
        //   icon: 'mdi-map-marker',
        //   title: 'แผนที่',
        //   to: '/manage/map',
        // },
        // {
        //   icon: 'mdi-bell-circle',
        //   title: 'รายงาน',
        //   to: '/volunteen/report',
        // },
        {
          icon: 'mdi-folder-account-outline',
          title: 'ผู้ป่วยที่อยู่ในการดูแล',
          to: '/volunteen/takecareuser',
        },
        // {
        //   icon: 'mdi-archive-edit-outline',
        //   title: 'อัพเดพสถานนะผู้ป่วย',
        //   to: '/volunteen/updatestatus',
        // },
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
      profile: [
        { title: 'แก้ไขข้อมูลส่วนตัว', func: '' },
        { title: 'ออกจากระบบ', func: 'logout' },
      ],
    }
  },
  async fetch() {
    console.log('this profile_id : ', this.$auth.user.group_id)
    if (this.$auth.user.group_id === '51b0e763-1f09-416a-afa9-d2f0ce78e9e6') {
      this.items = this.items_user
    } else if (
      this.$auth.user.group_id === '87191711-d7ff-4664-b648-8e9bceaab5ea'
    ) {
      this.items = this.items_volunteen
    } else if (
      this.$auth.user.group_id === '4e095238-1b60-4303-a207-8927d9c992d5'
    ) {
      this.items = this.items_admin
    }
    await this.setUserStore()
  },
  methods: {
    goToUserpage() {
      this.$router.push('/users')
    },
    async logout() {
      await this.$auth.logout()
      this.$router.push('/')
    },
    async setUserStore() {
      const { result } = await this.$axios.$post('/api/users/getByUserId', {
        id: this.$auth.user.id,
        group_id: this.$auth.user.group_id,
      })
      console.log('result for set: ', result)
      this.$store.commit('SET_userInfo', {
        userInfo: {
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          tel: result.tel,
          position: result.position,
          address_from_gmap: result.address_from_gmap,
          address_from_user: result.address_from_user,
          address_id: result.address_id,
        },
      })
    },
  },
}
</script>
<style scoped>
.tile {
  margin: 5px;
  border-radius: 4px;
}
.tile:hover {
  background: #6200ea !important;
  color: white !important;
  box-shadow: 0 16px 38px -12px rgb(0 0 0 / 56%), 0 4px 25px 0 rgb(0 0 0 / 12%),
    0 8px 10px -5px rgb(0 0 0 / 20%) !important;
}
.title-logout {
  margin: 5px;
  border-radius: 4px;
}
.title-logout:hover {
  background: #6200ea !important;
  color: white !important;
  box-shadow: 0 16px 38px -12px rgb(0 0 0 / 56%), 0 4px 25px 0 rgb(0 0 0 / 12%),
    0 8px 10px -5px rgb(0 0 0 / 20%) !important;
}
.bg-purple {
  background: #ddcfff;
}
</style>
