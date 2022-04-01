import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCOeFXWFa4nLSuKKo5-pBNCrB-JkP6MrWk",
    libraries: ["places", "geometry"],
    region: 'TH',
    language: 'TH'
  }
});
