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
        <q-field label="Device Name">
         <q-input  v-model="device.name"/>
        </q-field>
        <q-field label="Type">
         <q-select disable v-model="device.type" :options="deviceTypesOptions()" @input="changeType(device)"/>
        </q-field>
        <q-field label="Description">
          <q-input  v-model="device.desc"/>
        </q-field>
        <q-form class="" @input="update(device,$event)" :values="device.settings" :schema="deviceTypes[device.type].settings" ></q-form>
        <q-btn color="positive" @click="saveChanges(device,index)">Save Changes</q-btn>
        <q-btn color="negative" @click="discardChanges(device,index)">Discard Changes</q-btn>
      </q-collapsible>
    </div>
    </div>
    </q-list>

   </div>
</template>

<script>

import api from 'src/api'
// import db from 'src/components/helpers/database'
import { Toast, Dialog } from 'quasar'
import QForm from '../helpers/Form.vue'
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
            handler: () => {
              console.log('removing device', device.name)
              hardware.remove(device._id)
              this.$data.devices.splice(index, 1)
              return true
            }
          }
        ]
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
    },
    changeType (device) {
      console.log('the new type is', device.type)
      device.settings = {}
      // initialize new settings
 //     hardware.update(device._id, device)
 //     hardware.get(device._id).then(data => console.log('device as saved', data))
    },
    saveChanges (device) {
      hardware.update(device._id, device)
      hardware.get(device._id).then(data => console.log('device as saved', data))
    },
    discardChanges (device) {
      hardware.get(device._id).then(response => {
        console.log('device inside then', device)
        for (let key in device) { device[key] = response[key] }
        console.log('changes discarded reverting to', response)
      })
    },
    update (device, setting) {
      console.log('setting from form', setting)
      device.settings[setting.name] = setting.value
    }
  },
  computed: {
  },
  components: {
    QForm
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
    })
      .then((response) => {
        this.$data.devices = response.data
        console.log('loaded devices', response.data)
      })
      .catch((err) => {
        console.log('find error', err)
      })
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
