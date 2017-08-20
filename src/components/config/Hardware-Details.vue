<template>
    <div>
      {{ device }}
      <q-field
        label="Hardware Type"
        helper="Select Hardware Type"
      >
      <!-- q-select
        v-model="device.type"
        float-label="Is Quasar Awesome?"
        radio
       :options="selectOptions"
      / -->
    </q-field>
    </div>
</template>

<script>

import api from 'src/api'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      device: this.pDevice,
      updated: false,
      types: {}

    }
  },
  props: ['pDevice'],
  computed: {
  },
  methods: {
  },
  watch: {
  },
  components: {
  },
  mounted () {
    hardware.find({
      paginate: false,
      query: { doctype: 'types' }
    })
      .then((response) => {
        this.types = response.data
        console.log('types from server', response.data)
      })
      .catch((err) => {
        console.log('find error', err)
      })
  }
}
</script>

<style>

</style>
