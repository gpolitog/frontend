<template>
  <div>
    <div class="row">
      <h4>Circuits</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="add()">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A Relay Controlled Circuit to the System
      </q-tooltip>
      </q-btn>
      <q-btn color="secondary" @click="load(0)">Sort by Relay Bank
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Sort by Relay Bank, Port and Pin
      </q-tooltip>
      </q-btn>
      <q-btn color="secondary" @click="load(1)">Sort by Name
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Sort by Name
      </q-tooltip>
      </q-btn>
      <q-btn color="secondary" @click="load(2)">Sort by Location
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Sort by Location (floor or outside) then Name
      </q-tooltip>
      </q-btn>
      filter by bank
      <q-radio v-model="bank" val="-1" label="all" />
      <q-radio v-model="bank" val="-2" label="new" />
      <q-radio v-model="bank" val="0" label="1" />
      <q-radio v-model="bank" val="3" label="2" />
      <q-radio v-model="bank" val="1" label="3" />
      <q-radio v-model="bank" val="2" label="4" />
      </div>

    <q-list>
      <div class="row no-wrap" v-for="(item, index) in filtered()">
        <q-formc class="col-8" :item="item" :schema="schema" @changed="updateItem" :saved="saved" @save="saveChanges" @reset="reset"></q-formc>
        <q-btn class="col-1" color= "warning" icon="fa-close" @click="remove(item,index)">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
           Delete {{ itemName }} - {{ item.name }}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-3" :class= "state(item)" @click="toggle(item,index)">Toggle Circuit
        </q-btn>
      </div>
    </q-list>

   </div>
</template>

<script>

import api from 'src/api'
import { Toast, Dialog } from 'quasar'
import QFormc from '../helpers/CollapsibleForm.vue'

// import find from 'lodash.find'
import findIndex from 'lodash.findindex'
import filter from 'lodash.filter'

const circuits = api.service('circuits')
const hardware = api.service('hardware')

const sorts = [
  { bankid: -1, port: -1, pin: -1 },
  { name: 1 },
  { location: 1, name: 1 }
]

export default {
  data () {
    return {
      items: [],
      itemName: 'circuit',
      schema: {},
      saved: true,
      ready: false,
      sort: 2,
      banks: [],
      bank: -1
    }
  },
  methods: {
    load (sort = this.sort) {
      circuits.find({
        query: {
          $sort: sorts[sort]
        },
        paginate: false
      })
      .then((response) => {
        this.$data.items = response.data
        console.log('circuits loaded', response.data)
      })
      .catch((err) => {
        console.log('error loading circuits from server', err)
      })
    },
    filtered () {
      console.log(this.banks, this.bank, this.banks[this.bank])
      if (this.bank === '-2') {
        return filter(this.$data.items, item => { return item.bankid === '' })
      }
      if (this.bank !== '-1') {
        return filter(this.$data.items, item => {
          if (this.banks[this.bank]._id) {
            return item.bankid === this.banks[this.bank]._id
          }
          return false
        })
      }
      return this.$data.items
    },
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
          this.$data.saved = true
        })
    },
    reset (item) {
      circuits.get(item._id).then(response => {
        // console.log('device inside then', device)
        for (let key in item) { item[key] = response[key] }
        Toast.create.positive('reverted to last saved')
        console.log('changes discarded reverting to', response)
        this.$data.saved = true
      })
    },
    updateItem (update) {
      for (let index in this.$data.items) {
        if (this.$data.items[index]._id === update.id) {
          this.$data.items[index][update.setting.name] = update.setting.value
          // console.log('form field update', update.setting.name, this.$data.items[update.type][index][update.setting.name])
          this.$data.saved = false
          return
        }
      }
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
      let request = !item.on
      console.log('state change request of', request ? 'on' : 'off', item.name)
      circuits.get(item._id)
       .then(current => {
         if (request !== current.on) {
           console.log(`patching a state change request = ${request ? 'on' : 'off'} for ${current.name}`)
           circuits.patch(item._id, { request: request })
         }
       })
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
          this.banks = banks
          console.log('bank options', this.$data.schema.bankid.fieldProps.options)
        })
        .catch((err) => {
          console.log('error getting relay banks', err)
        })
    }
  },
  components: {
    QFormc
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
      this.load() // load circuits
    })
    .catch((err) => {
      console.log('error loading schema from server', err)
    })

    circuits.on('changeComplete', res => {
      let index = findIndex(this.items, { _id: res.id })
      this.items[index].on = res.on
      console.log('change complete for', this.items[index].name, this.items[index].on ? 'on' : 'off')
      // Toast.create.info(`Circuit ${this.items[index].name} is now ${this.state(this.items[index])}`)
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
