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
         <div class="row no-wrap" v-for="(item, index) in $data.items[type]">
           <q-formc class="col-11" :item="item" :schema="schema[type]" @changed="updateItem" :saved="saved" @save="saveChanges" @reset="reset"></q-formc>
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
                 // console.log('last before add', this.$data.items[data.type][this.$data.items[data.type].length - 1])
                 this.$data.items[data.type].push(response)
                 if (data.type === 'view') { this.viewsOptions(response, 'add') }
                 // console.log('last after add', this.$data.items[data.type][this.$data.items[data.type].length - 1])
                 Toast.create.positive(`${data.type} ${this.$data.itemName} {response.name} created, now edit and save`)
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
                  // this.$data.items[item.type].splice(index, 1)
                  this.$data.items[item.type].splice(index, 1)
                  if (item.type === 'view') { this.viewsOptions(item, 'remove') }
                  Toast.create.positive(`${item.name} is removed`)
                  return true
                })
            }
          }
        ]
      })
    },
    updateItem (update) {
      for (let index in this.$data.items[update.type]) {
        if (this.$data.items[update.type][index]._id === update.id) {
          this.$data.items[update.type][index][update.setting.name] = update.setting.value
          // console.log('form field update', update.setting.name, this.$data.items[update.type][index][update.setting.name])
          this.$data.saved = false
          return
        }
      }
    },
    saveChanges (item) {
      // before update have hook check is name is unique
      // only really need to update keys that have changed using patch
      switches.update(item._id, item)
        .then(() => {
          if (item.type === 'view') { this.viewsOptions(item, 'update') }
          Toast.create.positive('changes saved')
          this.$data.saved = true
        })
    },
    reset (item) {
      switches.get(item._id)
        .then((response) => {
          for (let index in this.$data.items[item.type]) {
            if (this.$data.items[item.type][index]._id === item._id) {
              // console.log(this.$data.items[item.type], item._id, index, response)
              for (let key in this.$data.items[item.type][index]) { this.$data.items[item.type][index][key] = response[key] }
              Toast.create.positive(`reverted to last saved for ${this.$data.items[item.type][index].name}`)
              this.$data.saved = true
              return
            }
          }
          Toast.create.negative('error - not able reset to last saved')
        })
       .catch((err) => {
         console.log('error unable to get data from server', err)
       })
    },
    state (item) {
      if (item.on) { return 'on' }
      else { return 'off' }
    },
    toggle (item) {
//      let state = !item.on
      console.log('Toggling state for ', item.name)
//   circuits.patch(item._id, { on: state })
    },
    viewsOptions (change, mode = 'add') {
      console.log('view options was passed', change, mode)
      if (!change) {
        let options = []
        let views = this.$data.items.view
        console.log('loading view options from scratch', this.$data.items.view)
        let option = {}
        for (let view in views) {
          option = {label: views[view].name, value: views[view]._id}
          options.push(option)
        }
        this.$data.schema.virtual.views.fieldProps.options = options
      }
      else {
        switch (mode) {
          case 'add':
            console.log('adding a view option', change.name)
            this.$data.schema.virtual.views.fieldProps.options.push({label: change.name, value: change._id})
            break
          case 'remove':
            console.log('removing a view option', change.name)
             // TODO dialog do you really want to delete this view (this view removed from all virtual switches
            // go through all virtual switches removing this view and save them to server
            // now find this view in options and remove it.
            break
          case 'update':
            for (let index in this.$data.schema.virtual.views.fieldProps.options) {
              console.log('updating a view option when', index, change._id, ' = ', this.$data.schema.virtual.views.fieldProps.options[index].value)
              if (change._id === this.$data.schema.virtual.views.fieldProps.options[index].value) {
                console.log('new view name', this.$data.schema.virtual.views.fieldProps.options[index].label, change.name)
                this.$data.schema.virtual.views.fieldProps.options[index].label = change.name
                break
              }
            }
            break
        }
      }
      console.log(`view options ${this.$data.schema.virtual.views.fieldProps.options}`)
    },
    // TODO make responsive to changes in device hardware
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
    // TODO make responsive to changes in circuits
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
          // this.$data.items[type] = response.data
          this.$set(this.items, type, response.data)
          console.log(type, ' switches loaded ', this.$data.items[type])
        })
        .catch((err) => {
          console.log(type, 'error loading switches from server', err)
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
