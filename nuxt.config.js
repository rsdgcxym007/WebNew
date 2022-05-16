import colors from 'vuetify/es5/util/colors'
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - covid-web-app',
    title: 'covid-web-app',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: [{
      src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCOeFXWFa4nLSuKKo5-pBNCrB-JkP6MrWk&libraries=places'
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@assets/css/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{
      src: "~/plugins/google-maps",
      ssr: true
    },
    {
      src: "~/plugins/apex-chart",
      ssr: false
    },
    {
      src: '~/plugins/notifications-ssr',
      ssr: true
    },
    {
      src: '~/plugins/notifications-client',
      ssr: false
    },
    '~/plugins/constants/index.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'nuxt-sweetalert2',
    '@nuxtjs/auth-next',
    // ['nuxt-gmaps', {
    //   key: 'AIzaSyCOeFXWFa4nLSuKKo5-pBNCrB-JkP6MrWk',
    // }]
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    credentials: true
  },
  proxy: {
    '/api': {
      target: 'http://localhost:9000'
    }
  },
  auth: {
    strategies: {
      // facebook: {
      //   endpoints: {
      //     userInfo: 'https://graph.facebook.com/v6.0/me?fields=id,name,picture{url}'
      //   },
      //   clientId: '974165653138352',
      //   scope: ['public_profile', 'email']
      // },
      local: {
        user: {
          property: false, // <--- Default "user"
          autoFetch: true
        },
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/api/auth/user',
            method: 'get',
            propertyName: ''
          }
        }
      }
    },
    redirect: {
      login: '/',
      callback: '/',
      home: '/manage'
    }
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#6200ea'
        },
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
  },
  server: {
    host: "0.0.0.0"
  }
}
