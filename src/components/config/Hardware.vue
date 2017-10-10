<template>
  <div>
    <div class="row">
      <h4>Hardware Devices</h4>
      <q-btn icon="fa-plus" small color="secondary" round @click="add()">
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add A Hardware Device to the System
      </q-tooltip>
    </q-btn>
  </div>
           <q-list>
             <div class="row no-wrap" v-for="(item, index) in $data.items">
               <q-formc class="col-11" :item="item" :schema="schema[item.hardware].settings" @changed="updateItem" :saved="saved" @save="saveChanges" @reset="reset"></q-formc>
               <q-btn class="col-1" color= "warning" icon="fa-close" @click="remove(item,index)">
                 <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
                  Delete {{ itemName }} - {{ item.name }}
                 </q-tooltip>
               </q-btn>
             </div>
           </q-list>
</div>
</template>

<script>

import api from 'src/api'
import { Toast, Dialog } from 'quasar'
// import QForm from '../helpers/Form.vue'
import QFormc from '../helpers/CollapsibleForm.vue'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      items: [],
      itemName: 'hardware',
      hardwareOpts: [],
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
            label: 'Choose the hardware'
          },
          hardware: {
            type: 'radio',
            items: this.hardwareOpts,
            model: ''
          }
        },
        buttons: [
          {
            label: 'create',
            color: 'positive',
            handler: (data) => {
              console.log('dialog data', data)
              hardware.create({'name': data.name, 'desc': data.desc, 'hardware': data.hardware})
               .then(response => {
                 console.log('created document id= ', response._id)
                 this.$data.items.push(response)
                 Toast.create.positive('new device created')
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
              hardware.remove(item._id)
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
    saveChanges (item) {
      // before update have hook check is name is unique
      // only really need to update keys that have changed using patch
      hardware.update(item._id, item)
        .then(() => {
          Toast.create.positive('changes saved')
          this.$data.saved = true
        })
    },
    reset (item) {
      hardware.get(item._id)
        .then((response) => {
          for (let index in this.$data.items[item.type]) {
            if (this.$data.items[index]._id === item._id) {
              // console.log(this.$data.items[item.type], item._id, index, response)
              for (let key in this.$data.items[index]) { this.$data.items[index][key] = response[key] }
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
    hardwareOptions () {
      let opts = []
      for (let hardware in this.schema) {
        // console.log('hardware', hardware, this.schema[hardware].label)
        opts.push({ label: this.schema[hardware].label, value: hardware })
        // console.log('opts', opts)
      }
      for (let hardware in this.schema) {
        this.schema[hardware].settings.hardware.fieldProps.options = opts
      }
      this.hardwareOpts = opts
    }
  },
  beforeMount () {
    hardware.get('schemas')
      .then((schema) => {
        console.log('loaded hardware schemas', schema)
        this.$data.schema = schema
        this.hardwareOptions()
        return hardware.find({
          paginate: false
        })
          .then((response) => {
            this.$data.items = response.data
            console.log(' devices loaded ', this.items)
            this.$data.ready = true
          })
          .catch((err) => {
            console.log('error loading devices from server', err)
          })
      })
      .catch((err) => {
        console.log('error loading hardware schema from server', err)
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
