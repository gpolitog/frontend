<template>
  <div>Hardware Configuration


    <q-list>
    <div v-for="(device, index) in devices">
      <q-collapsible :class="isOpened(index)" @open="opened(index)" @close="closed(index)" v-on:remove v-on:add :label="device.name">
        <div>

<hardware-details class="" :pDevice="device"></hardware-details>

<q-btn color="positive" @click="updateDevice(device,index)">Update Device</q-btn>
<q-btn color="negative" @click="removeDevice(device,index)">Delete Device</q-btn>
        </div>
      </q-collapsible>
    </div>
    </q-list>

    <q-fixed-position corner="bottom-right" :offset="[18, 18]" >
    <q-fab
      color="primary"
      icon="fa-plus"
      direction="up"
    >
      <q-fab-action color="secondary" @click="addDevice('Add a Hardware Device')" icon="fa-plus">
        <q-tooltip anchor="center left" self="center right" :offset="[0, 0]">Add a Hardware Device</q-tooltip>
      </q-fab-action>
      <q-fab-action color="secondary" @click="addDeviceType()" icon="fa-plus">
        <q-tooltip anchor="center left" self="center right" :offset="[0, 0]">Add a Hardware Device Type</q-tooltip>
      </q-fab-action>
    </q-fab>
    </q-fixed-position>


<!-- q-fixed-position corner="bottom-right" :offset="[18, 18]">
    <q-btn icon="fa-plus" small round @click="addDevice('Hardware Device')" >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add a hardware device/board
      </q-tooltip>
    </q-btn>
</q-fixed-position -->

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
      'isOpen': []
    }
  },
  methods: {
    addDevice (text) {
      db.newDocument.bind(hardware)(text)
      // this.$data.devices.push({'name': 'test'})
    },
    removeDevice (device, index) {
      console.log('removing device', device.name)
      hardware.remove(device._id)
      this.$data.devices.splice(index, 1)
    },
    hardwareupdate () {
      console.log('data to write', this.$data.curr)
      hardware.patch(this.$data.curr._id, this.$data.curr)
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
    hardware.find({
      paginate: false
    })
      .then((response) => {
        this.$data.devices = response.data
        console.log('find from server', response.data)
      })
      .catch((err) => {
        console.log('find error', err)
      })

    hardware.on('created', device => {
      console.log('a device was added now update list', device)
      this.$data.devices.push(device)
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
