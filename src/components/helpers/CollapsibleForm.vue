<template>
  <div>
    <q-collapsible v-on:remove v-on:add :label="item.name">
      <q-form class="" @changed="update(item,$event)" :values="item" :schema="schema"></q-form>
        <q-btn color="positive" :disable="saved" icon="fa-save" @click="saveChanges(item)">Save Changes
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
           Save Changes to Server
          </q-tooltip>
        </q-btn>

        <q-btn color="warning" :disable="saved" icon="fa-trash-o" @click="discardChanges(item)">Discard Changes
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
           Revert to last saved changes
          </q-tooltip>
        </q-btn>

      </q-collapsible>
      <!-- q-btn class="col-2" :class= "state(item)" @click="toggle(item,index)">Test
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         Click to test switch
        </q-tooltip>
      </q-btn -->
   </div>
</template>

<script>

// import api from 'src/api'
// import { Toast } from 'quasar'
import QForm from './Form.vue'
// const service = api.service(this.service)

export default {
  data () {
    return {
    }
  },
  props: [ 'item', 'schema', 'saved' ],
  computed: {
  },
  methods: {
    saveChanges (item) {
      this.$emit('save', item)
    },
    discardChanges (item) {
      this.$emit('reset', item)
    },
    update (item, setting) {
      setting.id = item._id
      // item[setting.name] = setting.value
      // console.log('updating', item.name, setting.name, setting.value, item[setting.name])
      this.$emit('changed', { id: item._id, type: item.type, setting: setting })
      this.unsaved = true
    },
    // nameUnique (item, index) {
      //  do unique checking on loaded names
      // Toast.create.negative('Need to Check for Unique Name')
    // },
    state (item) {
      if (item.on) { return 'on' }
      else { return 'off' }
    }
  },
  components: {
    QForm
  }
}
</script>

<style lang="stylus">

@import '~variables'

.on
    background $positive

.off
    background grey


</style>
