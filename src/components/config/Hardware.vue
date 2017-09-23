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
    </q-btn>
      <q-collapsible class="" v-on:remove v-on:add :label="device.name">
        <q-field label="Device Name">
          <q-input  v-model="device.name" @blur="nameUnique(device, index)"/>
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
            Must be unique
          </q-tooltip> 
        </q-field>
        <q-field label="Type" class="disabled" :helper="deviceTypes[device.type].desc">
        {{ deviceTypes[device.type].label }} 
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       To change device type you must create a new device and delete this one
      </q-tooltip>  
        </q-field>
        <q-field label="Description">
          <q-input  @input="changed=true"  v-model="device.desc"/>
        </q-field>
        <q-form class="" @input="update(device,$event)" :values="device.settings" :schema="deviceTypes[device.type].settings" ></q-form>
        <q-btn color="positive" :disable="!changed" icon="fa-save" @click="saveChanges(device,index)">Save Changes
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Save Changes to Server - Update Hardware Controller
      </q-tooltip>   
       </q-btn>
       <q-btn color="warning" :disable="!changed" icon="fa-trash-o" @click="discardChanges(device,index)">Discard Changes
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Revert to last saved changes
      </q-tooltip>   
      </q-btn>
      <q-btn color= "negative" icon="fa-close" @click="removeDevice(device,index)">Delete Device
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Delete This Device
      </q-tooltip>       
      </q-btn>

      </q-collapsible>
    </div>
    </div>
    </q-list>

   </div>
</template>

<script>

import api from 'src/api'
import { Toast, Dialog } from 'quasar'
import QForm from '../helpers/Form.vue'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      devices: [],
      'types': [],
      'deviceSchema': {},
      'deviceTypes': {},
      changed: false
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
          desc: {
            type: 'text',
            label: 'Enter a Description',
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
              // could initialize all the settings instead of writing to server with init hook
              hardware.create({'name': data.name, 'desc': data.desc, 'type': data.type})
               .then(response => {
                 console.log('created document id= ', response._id)
                 this.$data.devices.push(response)
                 Toast.create.positive('new entry created')
                 return response._id
               })
               .catch((err) => {
                 console.log('find error', err)
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
                .then(() => {
                  this.$data.devices.splice(index, 1)
                  Toast.create.positive(`${device.name} is removed`)
                  return true
                })
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
        opts.push({ label: types[type].label, value: type })
      }
      console.log('opts', opts)
      return opts
    },
    saveChanges (device) {
      // before update have hook check is name is unique
      // only really need to update keys that have changed
      hardware.update(device._id, device)
        .then(() => {
          Toast.create.positive('device changes saved')
          this.$data.changed = false
        })
      // hardware.get(device._id).then(data => console.log('device as saved', data))
    },
    discardChanges (device) {
      hardware.get(device._id).then(response => {
        // console.log('device inside then', device)
        for (let key in device) { device[key] = response[key] }
        Toast.create.positive('reverted to last saved')
        console.log('changes discarded reverting to', response)
        this.changed = false
      })
    },
    update (device, setting) {
      // console.log('setting from form', setting)
      device.settings[setting.name] = setting.value
      this.$data.changed = true
    },
    nameUnique (device, index) {
      //  do unique checking on loaded names
      Toast.create.negative('Need to Check for Unique Name')
    }
  },
  computed: {
  },
  components: {
    QForm
  },
  mounted () {
    // const switches = api.service('switches')

    hardware.get('schemas')
    .then((schemas) => {
      // console.log('loaded device type schemas', schemas.deviceTypes.mcp17.settings)
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

.q-field-content
  .q-field-helper
    background $tertiary
    color white

.q-field-label
  color blue

.q-field-content
.q-input-target
   color white
   background $blue-10

// dialog inputs
.modal 
  .q-input-target
    color black
    background white

.disabled
    color grey


</style>
