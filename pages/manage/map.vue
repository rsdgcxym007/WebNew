<template>
  <div>
    <pre>lat: {{ lat }} lng: {{ lng }}</pre>
    <h1>Autocomplete Example (#164)</h1>
    <label>
      AutoComplete

      <gmap-autocomplete
        placeholder="This is a placeholder text"
        @place_changed="setPlace"
      >
      </gmap-autocomplete>
      <button @click="usePlace">Add</button>
    </label>
    <br />

    <Gmap-Map
      style="width: 600px; height: 300px"
      :zoom="7"
      :center="{ lat: currentLocation.lat, lng: currentLocation.lng }"
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
      <Gmap-Marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
      ></Gmap-Marker>
      <Gmap-Marker
        v-if="this.place"
        label="&#x2605;"
        :position="{
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }"
      ></Gmap-Marker>
    </Gmap-Map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      markers: [],
      place: null,
      currentLocation: { lat: 13, lng: 100 },
      lat: 0,
      lng: 0,
    }
  },
  mounted: function () {
    this.geolocation()
  },
  methods: {
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

      this.lat = this.place.geometry.location.lat()
      this.lng = this.place.geometry.location.lng()
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          },
        })
        this.place = null
      }
    },
  },
}
</script>
