<template>
  <div>
    <div class="row">
      <h4>Circuits</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="add()">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A Relay Controlled Circuit to the System
      </q-tooltip>
    </q-btn>
    </div>

    <q-list>
    <div class="row no-wrap"  v-for="(item, index) in items">
      <q-collapsible class="col-8" v-on:remove v-on:add :label="item.name">

        <q-form class="" @input="update(item,$event)" :values="item" :schema="schema"></q-form>

      <q-btn color="positive" :disable="!changed" icon="fa-save" @click="saveChanges(item,index)">Save Changes
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         Save Changes to Server
        </q-tooltip>   
      </q-btn>
      <q-btn color="warning" :disable="!changed" icon="fa-trash-o" @click="discardChanges(item,index)">Discard Changes
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         Revert to last saved changes
        </q-tooltip>   
      </q-btn>
      <q-btn color= "negative" icon="fa-close" @click="remove(item,index)">Delete Circuit
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         Delete This Circuit
        </q-tooltip>       
      </q-btn>
      </q-collapsible>
        <q-btn :class= "state(item)" @click="toggle(item,index)">Toggle Circuit
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         Test Circuit by Turning on and off
        </q-tooltip>  
        </q-btn>
    </div>
    </q-list>

   </div>
</template>

<script>

import api from 'src/api'
import { Toast, Dialog } from 'quasar'
import QForm from '../helpers/Form.vue'
const circuits = api.service('circuits')

const hardware = api.service('hardware')

export default {
  data () {
    return {
      items: [],
      itemName: 'circuit',
      schema: {},
      changed: false
    }
  },
  methods: {
    add () {
      Dialog.create({
        title: `Add a ${this.$data.itemName}`,
        form: {
          name: {
            type: 'text',
            label: `Enter a unique ${this.$data.itemName} name`,
            model: '' }
        },
        buttons: [
          {
            label: 'create',
            color: 'positive',
            handler: (data) => {
              circuits.create({ 'name': data.name })
               .then(response => {
                 console.log('created document id= ', response._id)
                 this.$data.items.push(response)
                 Toast.create.positive(`new ${this.$data.itemName} created, now edit and save`)
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
    remove (item, index) {
      Dialog.create({
        title: 'Confirm',
        message: `Do you want to delete ${item.name}?`,
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
              console.log('removing..', item.name)
              circuits.remove(item._id)
                .then(() => {
                  this.$data.items.splice(index, 1)
                  Toast.create.positive(`${item.name} is removed`)
                  return true
                })
            }
          }
        ]
      })
    },
    saveChanges (item) {
      // before update have hook check is name is unique
      // only really need to update keys that have changed
      circuits.update(item._id, item)
        .then(() => {
          Toast.create.positive('changes saved')
          this.$data.changed = false
        })
    },
    discardChanges (item) {
      circuits.get(item._id).then(response => {
        // console.log('device inside then', device)
        for (let key in item) { item[key] = response[key] }
        Toast.create.positive('reverted to last saved')
        console.log('changes discarded reverting to', response)
        this.changed = false
      })
    },
    update (circuit, setting) {
      // console.log('setting from form', setting)
      circuit[setting.name] = setting.value
      this.$data.changed = true
    },
    nameUnique (device, index) {
      //  do unique checking on loaded names
      Toast.create.negative('Need to Check for Unique Name')
    },
    state (item) {
      if (item.on) { return 'on' }
      else { return 'off' }
    },
    toggle (item) {
      let state = !item.on
      console.log('Toggling state for ', item.name)
      circuits.patch(item._id, { on: state })
    },
    relayBanksOptions () {
      hardware.find({
        paginate: false,
        query: { category: 'relay', $select: [ '_id', 'name' ] }
      })
        .then((response) => {
          let option = {}
          let banks = response.data
          for (let bank in banks) {
            option = {label: banks[bank].name, value: banks[bank]._id}
            this.$data.schema.bankid.fieldProps.options.push(option)
          }
          console.log('bank options', this.$data.schema.bankid.fieldProps.options)
        })
        .catch((err) => {
          console.log('error getting relay banks', err)
        })
    }
  },
  components: {
    QForm
  },
  created () {
    // const switches = api.service('switches')

    circuits.get('schemas')
    .then((schema) => {
      console.log('loaded circuit schema', schema)
      this.$data.schema = schema
      // adds device relay banks to schema options at mount
      // if keeping component in memory will need to listen for changes to hardware
      this.relayBanksOptions()
    })
    .catch((err) => {
      console.log('error loading schema from server', err)
    })

    // load circuits
    circuits.find({
      paginate: false
    })
      .then((response) => {
        this.$data.items = response.data
        console.log('circuits loaded', response.data)
      })
      .catch((err) => {
        console.log('error loading circuits from server', err)
      })
    // server service emits stateChange event whenever change of state is written
    // all clients should listen for this
    circuits.on('stateChange', resp => {
      let circuit = resp.data
      console.log(`Updating circuit ${circuit.name}s state in component with ${this.state(circuit)}`)
      // use lowdash array find method? lowdb or objectdb from tasktimer guy
      for (let i in this.$data.items) {
        if (this.items[i]._id === circuit._id) {
          this.items[i].on = circuit.on
          Toast.create.info(`Circuit State Event => ${circuit.name} is now ${this.state(circuit)}`)
          return
        }
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

.on
    background $positive

.off
    background grey


</style>
