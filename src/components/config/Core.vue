<template>
  <div>Core Configuration


    <q-list>
    <div v-for="(device, index) in devices">
      <q-collapsible v-on:remove v-on:add :label="device.name">
        <div>
          {{device}}
          <q-btn @click="removeDevice(device,index)"> X </q-btn>
        </div>
      </q-collapsible>
    </div>
    </q-list>


<q-fixed-position corner="bottom-right" :offset="[18, 18]">
    <q-btn icon="fa-plus" small round @click="addDevice('hardware device')" >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Add a hardware device/board
      </q-tooltip>
    </q-btn>
</q-fixed-position>

   </div>
</template>

<script>

import api from 'src/api'
import db from 'src/components/helpers/database'
const core = api.service('core')

export default {
  data () {
    return {
      'devices': [],
      'curr': {}
    }
  },
  methods: {
    addDevice (text) {
      db.newDocument.bind(core)(text)
      // this.$data.devices.push({'name': 'test'})
    },
    removeDevice (device, index) {
      console.log('removing device', device.name)
      core.remove(device._id)
      this.$data.devices.splice(index, 1)
    },
    coreupdate () {
      console.log('data to write', this.$data.curr)
      core.patch(this.$data.curr._id, this.$data.curr)
    }
  },
  computed: {
    test () {
      console.log('test changed', this.$data.curr.text)
    }
  },
  mounted () {
    // const switches = api.service('switches')
    console.log('load in boards')
    core.find({
      paginate: false
    })
      .then((response) => {
        this.$data.devices = response.data
        console.log('find from server', response.data)
      })
      .catch((err) => {
        console.log('find error', err)
      })

    core.on('created', device => {
      console.log('a device was added now update list', device)
      this.$data.devices.push(device)
    })
  }
}
</script>

<style>
</style>
