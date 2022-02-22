<template>
  <div>
    <LongdoMap :center="map.center" :apiKey="map.apiKey"> </LongdoMap>
  </div>
</template>

<script>
import { LongdoMap, LongdoMapMarker, LongdoMapPopup } from 'vue-longdo-map'

export default {
  name: 'longdo-map',
  components: {
    LongdoMap,
    LongdoMapMarker,
    LongdoMapPopup,
  },
  data() {
    return {
      map: {
        apiKey: '4d19c1620f2641a9cda0e03896770352',
        center: {
          lon: 100,
          lat: 16,
        },
      },
    }
  },
}
</script>
