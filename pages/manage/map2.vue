<template>
  <div>
    <gmap-map
      ref="gmap"
      :center="center"
      :zoom="12"
      style="width: 100%; height: 100vh"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="toggleInfoWindow(m, index)"
      >
      </gmap-marker>

      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
        <div v-html="infoContent"></div>
      </gmap-info-window>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  data() {
    return {
      //a default center for the map
      center: { lat: 52.51195, lng: 6.089625 },
      map: null,
      infoContent: '',
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      markers: [
        {
          name: 'House of Aleida Greve',
          description: 'description 1',
          date_build: '',
          position: { lat: 52.512942, lng: 6.089625 },
        },
        {
          name: 'House of Potgieter',
          description: 'description 2',
          date_build: '',
          position: { lat: 52.51195, lng: 6.091056 },
        },
        {
          name: 'House of Johannes Cele',
          description: 'description 3',
          date_build: '',
          position: { lat: 52.511047, lng: 6.091728 },
        },
      ],
    }
  },
  mounted() {
    //set bounds of the map
    this.$refs.gmap.$mapPromise.then((map) => {
      const bounds = new google.maps.LatLngBounds()
      for (let m of this.markers) {
        bounds.extend(m.position)
      }
      map.fitBounds(bounds)
    })
  },
  methods: {
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.position
      this.infoContent = this.getInfoWindowContent(marker)

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    },

    getInfoWindowContent: function (marker) {
      return `<div class="card">
  <div class="card-image">
    <figure class="image is-4by3">
      <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">${marker.name}</p>
      </div>
    </div>
    <div class="content">
      ${marker.description}
      <br>
      <time datetime="2016-1-1">${marker.date_build}</time>
    </div>
  </div>
</div>`
    },
  },
}
</script>
