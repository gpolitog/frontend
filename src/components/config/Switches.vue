<template>
  <div>
    <div class="row">
      <h4>Switches</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="add()">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A switch to the System
      </q-tooltip>
    </q-btn>
    </div>

<q-tabs color="secondary" v-if="ready"  inverted >
  <div v-for="type in Object.keys(schema)">
    <q-tab :name="type"  :label="type"  slot="title" />
     <q-tab-pane :name="type">
       <q-list>
         <div class="row" v-for="(item, index) in items[type]">
           <q-formc class="col-11" :item="item" :schema="schema[type]" @changed="saved=false" :saved="saved" @save="saveChanges"></q-formc>
           <q-btn class="col-1" color= "warning" icon="fa-close" @click="remove(item,index)">
             <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
              Delete {{ itemName }} - {{ item.name }}
             </q-tooltip>
           </q-btn>
         </div>
       </q-list>
     </q-tab-pane>
   </div>
</q-tabs>

</div>
</template>

<script>

import api from 'src/api'
import { Toast, Dialog } from 'quasar'
// import QForm from '../helpers/Form.vue'
import QFormc from '../helpers/CollapsibleForm.vue'
const switches = api.service('switches')
const hardware = api.service('hardware')
const circuits = api.service('circuits')

export default {
  data () {
    return {
      items: {},
      itemName: 'switch',
      schema: {},
      saved: true,
      ready: false
    }
  },
  components: {
    QFormc
  },
  methods: {
    add () {
      Dialog.create({
        title: `Add a ${this.$data.itemName}`,
        form: {
          name: {
            type: 'text',
            label: `Enter a unique ${this.$data.itemName} name`,
            model: '' },
          header1: {
            type: 'heading',
            label: 'Choose switch type'
          },
          type: {
            type: 'radio',
            items: [
              { label: 'Physical', value: 'physical' },
              { label: 'Virtual', value: 'virtual' },
              { label: 'View', value: 'view' }
            ],
            model: ''
          }
        },
        buttons: [
          {
            label: 'create',
            color: 'positive',
            handler: (data) => {
              switches.create({ 'name': data.name, type: data.type })
               .then(response => {
                 console.log('created document id= ', response._id)
                 this.$data.items[data.type].push(response)
                 Toast.create.positive(`${data.type} ${this.$data.itemName} created, now edit and save`)
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
        message: `Do you want to delete ${item.name} - ${item.type}?`,
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
              switches.remove(item._id)
                .then(() => {
                  console.log('after', this.$data.items[item.type])
                  this.$data.items[item.type].splice(index, 1)
                  console.log('after', this.$data.items[item.type])
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
      // only really need to update keys that have changed using patch
      switches.update(item._id, item)
        .then(() => {
          Toast.create.positive('changes saved')
          this.$data.saved = true
        })
    },
    state (item) {
      if (item.on) { return 'on' }
      else { return 'off' }
    },
    itemsByType (type) {
      console.log('items by type', type, this.$data.items[type])
      return this.$data.items[type][0]
    },
    schemaByType (type) {
      console.log('schema by type', type, this.$data.schema[type])
      return this.$data.schema[type]
    },
    toggle (item) {
//      let state = !item.on
      console.log('Toggling state for ', item.name)
//   circuits.patch(item._id, { on: state })
    },
    viewsOptions () {
      let option = {}
      for (let view in this.$data.items.view) {
        option = {label: view.name, value: view.name}
        this.$data.schema.virtual.views.fieldProps.options.push(option)
      }
      console.log('view options', this.$data.schema.virtual.views.fieldProps.options)
    },
    switchBanksOptions () {
      return hardware.find({
        paginate: false,
        query: { category: 'switch', $select: [ '_id', 'name' ] }
      })
        .then((response) => {
          let option = {}
          let banks = response.data
          for (let bank in banks) {
            option = {label: banks[bank].name, value: banks[bank]._id}
            this.$data.schema.physical.bankid.fieldProps.options.push(option)
          }
          console.log('bank options', this.$data.schema.physical.bankid.fieldProps.options)
        })
        .catch((err) => {
          console.log('error getting switch banks for options', err)
        })
    },
    circuitsOptions () {
      return circuits.find({
        paginate: false,
        query: { $select: [ '_id', 'name' ] }
      })
        .then((response) => {
          let option = {}
          let circuits = response.data
          for (let circuit in circuits) {
            option = {label: circuits[circuit].name, value: circuits[circuit]._id}
            this.$data.schema.physical.circuits.fieldProps.options.push(option)
            this.$data.schema.virtual.circuits.fieldProps.options.push(option)
          }
          console.log('circuit options', this.$data.schema.physical.circuits.fieldProps.options)
        })
        .catch((err) => {
          console.log('error getting circuits for options', err)
        })
    },
    getSwitches (type) {
      return switches.find({
        query: {
          type: type
        },
        paginate: false
      })
        .then((response) => {
          this.$data.items[type] = response.data
          console.log(type, ' switches loaded ', this.$data.items[type])
        })
        .catch((err) => {
          console.log('error loading switches from server', err)
        })
    }
  },
  beforeMount () {
    switches.get('schemas')
      .then((schema) => {
        console.log('loaded switch schemas', schema)
        this.$data.schema = schema
        // adds device relay banks to schema options at mount
        // if keeping component in memory will need to listen for changes to hardware
        let getData = Object.keys(this.$data.schema).map(this.getSwitches)
        getData.push(this.switchBanksOptions())
        getData.push(this.circuitsOptions())
        Promise.all(getData)
          .then(() => {
            this.viewsOptions()
            console.log('ready to render tabs')
            this.$data.ready = true
          })
          .catch((err) => {
            console.log('error loading switch data from server', err)
          })
      })
      .catch((err) => {
        console.log('error loading schema from server', err)
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

.physical
    background teal

.on
    background $positive

.off
    background grey


</style>
