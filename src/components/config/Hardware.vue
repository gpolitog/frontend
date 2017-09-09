<template>
  <div>
    <div class="row">
      <h4>Devices</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="addDevice()">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A Device
      </q-tooltip>
    </q-btn>
    </div>

    <q-list>
    <div v-for="(device, index) in devices">
      <div class="row no-wrap q-collapsible">
      <q-btn class="" icon="fa-close" @click="removeDevice(device,index)">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Delete This Device
      </q-tooltip>
    </q-btn>
      <q-collapsible class="col-11" v-on:remove v-on:add :label="device.name">
      <!-- <hardware-details class="" :pDevice="device"></hardware-details> -->
      <q-btn color="positive" @click="updateDevice(device,index)">Update Device</q-btn>
      </q-collapsible>
    </div>
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
      </q-collapsible>
    </div>
    </q-list>

   </div>
</template>

<script>

import api from 'src/api'
// import db from 'src/components/helpers/database'
import { Toast, Dialog } from 'quasar'
import hardwareDetails from 'src/components/config/Hardware-Details'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      'devices': [],
      'types': [],
      'deviceSchema': {},
      'deviceTypes': {}
    }
  },
  methods: {
    addDevice () {
      Dialog.create({
        title: 'Add a new device',
        form: {
          name: {
            type: 'text',
            label: 'Enter a unique device name',
            model: ''
          },
          header1: {
            type: 'heading',
            label: 'Choose a defined device type'
          },
          type: {
            type: 'radio',
            items: this.deviceTypesOptions(),
            model: ''
          }
        },
        buttons: [
          {
            label: 'create',
            color: 'positive',
            handler: (data) => {
              console.log('dialog data', data)
              hardware.create({'name': data.name, 'type': data.type})
            .then(response => {
              console.log('created document id= ', response._id)
              this.$data.devices.push(response)
              Toast.create.positive('new entry created')
              return response._id
            })
            }
          },
          {
            label: 'Cancel',
            color: 'negative',
            handler () {
              return false
            }
          }
        ]
      })
    },
    removeDevice (device, index) {
      Dialog.create({
        title: 'Confirm',
        message: `Do you want to delete device ${device.name}?`,
        buttons: [
          {
            label: 'No',
            handler () {
              return false
            }
          },
          {
            label: 'Yes',
            handler () {
              return true
            }
          }
        ]
      }).then(response => {
        if (response) {
          console.log('removing device', device.name)
          hardware.remove(device._id)
          this.$data.devices.splice(index, 1)
        }
      })
    },
    deviceTypesOptions () {
      let opts = []
      let types = this.$data.deviceTypes
      console.log('types', this.$data.deviceTypes)
      for (let type in types) {
        // console.log('type', types[type].label, types[type].name)
        opts.push({ label: types[type].label, value: types[type].name })
      }
      console.log('opts', opts)
      return opts
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

    hardware.get('schemas')
    .then((schemas) => {
      console.log('loaded device type schemas', schemas.deviceTypes)
      this.$data.deviceSchema = schemas.device
      this.$data.deviceTypes = schemas.deviceTypes
    })

    // load devices
    hardware.find({
      paginate: false
      // query: { doctype: 'device' }
    })
      .then((response) => {
        this.$data.devices = response.data
        console.log('loaded devices', response.data)
      })
      .catch((err) => {
        console.log('find error', err)
      })

      // load device types
    // hardware.find({
    //   paginate: false,
    //   query: { doctype: 'type' }
    // })
    //     .then((response) => {
    //       this.$data.types = response.data
    //       console.log('loaded types', response.data)
    //     })
    //     .catch((err) => {
    //       console.log('find error', err)
    //     })

    // hardware.on('created', doc => {
    //   console.log('a device was created fetch new doc', doc)
    //   if (doc.doctype === 'device') {
    //     hardware.get(doc._id)
    //        .then(response => {
    //          console.log('fetched new doc', response)
    //          this.$data.devices.push(doc)
    //        })
    //   }

      // if (doc.doctype === 'type') {
      //   console.log('a device type was added now update list')
      //   this.$data.types.push(doc)
      // }
    // })
  }
}
</script>

<style lang="stylus">

@import '~variables'

.q-collapsible
  background $secondary
  color white

.q-collapsible-opened
    background red
    color white

.q-collapsible-sub-item
  background $tertiary
  color white



</style>
