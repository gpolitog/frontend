<template>
  <div>
    <div class="row">
      <h4>Devices</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="addDevice('Add a Hardware Device')">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A Device
      </q-tooltip>
    </q-btn>
    </div>

    <q-list>
    <div v-for="(device, index) in devices">
      <!-- q-collapsible :class="isOpened(index)" @open="opened(index)" @close="closed(index)" v-on:remove v-on:add :label="device.name" -->
      <q-collapsible v-on:remove v-on:add :label="device.name">
      <hardware-details class="" :pDevice="device"></hardware-details>
      <q-btn color="negative" @click="removeDevice(device,index)">Delete Device</q-btn>
      </q-collapsible>
    </div>
    </q-list>

    <div class="row">
      <h4>Device Types</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="addDeviceType('Add a Hardware Device Type')">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A Device Type
      </q-tooltip>
    </q-btn>
    </div>
    <q-list>
    <div v-for="(type, index) in types">
      <!-- q-collapsible :class="isOpened(index)" @open="opened(index)" @close="closed(index)" v-on:remove v-on:add :label="type.name" -->
      <q-collapsible  v-on:remove v-on:add :label="type.name">
        {{ type }}
      <q-btn color="positive" @click="updateDevice(type,index)">Update Type</q-btn>
      <q-btn color="negative" @click="removeType(type,index)">Delete Type</q-btn>
      </q-collapsible>
    </div>
    </q-list>

   </div>
</template>

<script>

import api from 'src/api'
import db from 'src/components/helpers/database'
import hardwareDetails from 'src/components/config/Hardware-Details'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      'devices': [],
      'types': [],
      'isOpen': []
    }
  },
  methods: {
    addDevice (text) {
      db.newDocument.bind(hardware)(text, 'device')
    },
    addDeviceType (text) {
      db.newDocument.bind(hardware)(text, 'type')
    },
    removeDevice (device, index) {
      console.log('removing device', device.name)
      hardware.remove(device._id)
      this.$data.devices.splice(index, 1)
    },
    removeType (type, index) {
      console.log('removing device', type.name)
      hardware.remove(type._id)
      this.$data.types.splice(index, 1)
    },
    opened (index) {
      console.log('item opened', index)
      // have to use splice or the re-render won't be tripped for array elements
      this.isOpen.splice(index, 1, true)
      console.log('isOpen', index, this.isOpen[index])
    },
    closed (index) {
      console.log('item closed', index)
      this.isOpen.splice(index, 1, false)
      console.log('isOpen', index, this.isOpen[index])
    },
    isOpened: function (index) {
      console.log('returning particular open state', index, this.isOpen[index])
      return { 'q-collapsible--open': this.isOpen[index] }
    }
  },
  computed: {
  },
  components: {
    hardwareDetails
  },
  mounted () {
    // const switches = api.service('switches')
    console.log('load in boards')

    // load devices
    hardware.find({
      paginate: false,
      query: { doctype: 'device' }
    })
      .then((response) => {
        this.$data.devices = response.data
        console.log('loaded devices', response.data)
      })
      .catch((err) => {
        console.log('find error', err)
      })

      // load device types
    hardware.find({
      paginate: false,
      query: { doctype: 'type' }
    })
        .then((response) => {
          this.$data.types = response.data
          console.log('loaded types', response.data)
        })
        .catch((err) => {
          console.log('find error', err)
        })

    hardware.on('created', doc => {
      if (doc.doctype === 'device') {
        console.log('a device was added now update list')
        this.$data.devices.push(doc)
      }
      if (doc.doctype === 'type') {
        console.log('a device type was added now update list')
        this.$data.types.push(doc)
      }
    })
  }
}
</script>

<style lang="stylus">

@import '~variables'

.q-collapsible
  background $secondary
  color white

.q-collapsible--open
    background red
    color white

.q-collapsible-sub-item
  background $tertiary
  color white



</style>
