import Vue from 'vue'

// Prefered: as a plugin (directive + filter) + custom placeholders support
import VueMask from 'v-mask'
Vue.use(VueMask);

// Or as a directive-only
import {
  VueMaskDirective
} from 'v-mask'
Vue.directive('mask', VueMaskDirective);

// Or only as a filter-only
import {
  VueMaskFilter
} from 'v-mask'
Vue.filter('VMask', VueMaskFilter)

Vue.use(VueMask, { // (!) custom placeholders support requires registration as a plugin to
  placeholders: {
    '#': null, // passing `null` removes default placeholder, so `#` is treated as character
    D: /\d/, // define new placeholder
    Я: /[\wа-яА-Я]/, // cyrillic letter as a placeholder
  }
})
