<template>
  <div>
    <client-only>
      <vc-date-picker
        :value="value"
        :max-date="new Date()"
        mode="date"
        color="indigo"
        locale="th"
        :masks="{ input: formatDisplay }"
        :model-config="modelConfig"
        :update-on-input="updateOnInput"
        @input="selectDate"
      >
        <template slot="header-title" slot-scope="{ monthLabel, yearLabel }">
          {{ monthLabel }} {{ yearLabel | formatYear(buddhistYear) }}
        </template>
        <template v-slot="{ inputValue, togglePopover }">
          <v-text-field
            label="วันที่"
            outlined
            :value="displayInput(inputValue)"
            :readonly="inputReadonly"
            @click="togglePopover"
          ></v-text-field>
          <!-- <input
            :value="displayInput(inputValue)"
            :readonly="inputReadonly"
            @click="togglePopover"
          /> -->
        </template>
      </vc-date-picker>
    </client-only>
  </div>
</template>

<script>
export default {
  filters: {
    formatYear(year, buddhistYear) {
      return buddhistYear ? +year + 543 : year
    },
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    formatDisplay: {
      type: String,
      default: 'DD/MM/YYYY',
    },
    buddhistYear: {
      type: Boolean,
      default: false,
    },
    inputReadonly: {
      type: Boolean,
      default: true,
    },
    updateOnInput: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modelConfig: {
        type: 'string',
        mask: 'DD-MM-YY:mm:ss',
        timeAdjust: '00:00:00',
      },
    }
  },
  methods: {
    selectDate(event) {
      this.$emit('input', event)
    },
    displayInput(input) {
      if (input) {
        return this.buddhistYear
          ? this.$moment(input, this.formatDisplay)
              .add(543, 'y')
              .format(this.formatDisplay)
          : input
      } else {
        return ''
      }
    },
  },
}
</script>
<style scope>
.vc-day.is-not-in-month span {
  opacity: 0.5 !important;
  pointer-events: unset !important;
}
</style>
