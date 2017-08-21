<template>
    <div>
      {{ device }}
        <q-field label="Device Name">
          <q-input  v-model="device.name"/>
        </q-field>
       <q-field label="Type">
            <q-select v-model="device.type" :options="deviceTypes" />
        </q-field>
        <q-field label="Description">
          <q-input  v-model="device.desc"/>
        </q-field>
        <q-field label="I2C Address">
          <q-input  v-model="device.address"/>
        </q-field>
        <q-field label="Interrupt A pin number">
          <q-input  v-model="device.ipinA"/>
        </q-field>
        <q-field label="Interrupt B pin number">
          <q-input  v-model="device.ipinB"/>
        </q-field>
    <q-btn color="positive" :disabled="updated" @click="updateDevice()">Save Changes</q-btn>
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
      deviceTypes: []
    }
  },
  props: ['pDevice'],
  computed: {
  },
  methods: {
    updateDevice () {
      hardware.update(this.device._id, this.device)
      hardware.get(this.device._id).then(data => console.log('device as saved', data))
    }
  },
  watch: {
  },
  components: {
  },
  mounted () {
    // load device types into select options
    hardware.find({
      paginate: false,
      query: { doctype: 'type' }
    })
      .then((types) => {
        console.log(`loaded types: ${types.data[0].name}`)
        for (let type of types.data) {
          this.deviceTypes.push({ label: type.name, value: type.name })
        }
      })
      .catch((err) => {
        console.log('find error', err)
      })

    // save device details to compare for changes to enable update button.  do the same in update click function
    // watch for any focussed mouse event or keyup to compare to unlock button.
  }
}
</script>

<style lang="stylus">

@import '~variables'

.q-field-label
  color red

.q-field-content
    background $red-10

.q-input-target
    color blue



</style>
