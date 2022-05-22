import Vue from "vue";
import App from "./App.vue";
import VCalendar from "v-calendar";
import VueMoment from "vue-moment";

Vue.config.productionTip = false;

Vue.use(VCalendar, {
  componentPrefix: "vc"
});

Vue.use(VueMoment);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
