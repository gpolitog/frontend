<template>
<div>
  <div class="col-12 view" >{{ findOne('_id', curView, 'name', views) }}</div>
   <div class="xs-gutter" >
  <div class="row no-wrap" v-for="aswitch in filteredSwitches()" >
     <q-btn class="col-xs-10 col-sm-8 col-md-6 col-lg-4" icon="fa-switch" rounded :class="state(aswitch)" @click="toggle(aswitch)" >{{aswitch.name}} 
     </q-btn>
     <q-btn class="col-1" rounded small @click="" >
       <q-icon name="fa-eye" />
       <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         view circuits controlled by this switch 
       </q-tooltip>
     </q-btn>
  </div>
  </div>

<q-fixed-position corner="bottom-right" :offset="[18, 18]" >
<q-fab
  color="primary"
  icon="fa-list"
  active-icon="fa-list-alt"
  direction="up"
  @open="$refs.fabtp.open()"
>
  <q-fab-action v-for="view in views" :key="view._id" color="secondary" @click="filter(view)" icon="fa-list">
    <q-tooltip ref="fabtp" anchor="center left" self="center right" :offset="[0, 0]">{{ view.name }}</q-tooltip>
  </q-fab-action>
</q-fab>
</q-fixed-position>

</div>
</template>

<script>

// TODO m

import api from 'src/api'
const switches = api.service('switches')
const circuits = api.service('circuits')

export default {
  data () {
    return {
      switches: [],
      circuits: [],
      views: [],
      curView: 'all'
    }
  },
  computed: {
  },
  methods: {
    findOne (skey, value, rkey, items) {
      for (let item of items) {
        // console.log('findone', item.name, skey, rkey, item[skey], value)
        if (item[skey] === value) {
          return item[rkey]
        }
      }
      return null
    },
    filteredSwitches () {
      if (this.curView !== 'all') {
        let filtered = []
        for (let aswitch of this.switches) {
          console.log(aswitch.views, this.curView)
          if (aswitch.views.indexOf(this.curView) !== -1) {
            filtered.push(aswitch)
          }
        }
        console.log('all and filtered', this.switches, filtered)
        return filtered
      }
      return this.switches
    },
    filter (view) {
      this.curView = view._id
    },
    state (item) {
      if (item.on) { return 'on' }
      else { return 'off' }
    },
    toggle (item) {
      let state = !item.on
      console.log('Toggling state for ', item.name, state)
      switches.patch(item._id, { on: state })
    },
    getCircuits (aswitch) {
      let switchCircuits = []
      for (let cindex in this.circuits) {
        // console.log('aswitch, cindex', aswitch.name, cindex)
        if (aswitch.circuits.indexOf(this.circuits[cindex]._id) !== -1) {
          // console.log(this.circuits[cindex].name, cindex, this.circuits[cindex]._id, aswitch.circuits)
          switchCircuits.push(this.circuits[cindex])
        }
      }
      console.log(`the circuits for switch ${aswitch.name} are ${switchCircuits}`)
      return switchCircuits
    }
  },
  // props: ['filter'],
  mounted () {
    switches.find({
      query: { type: 'virtual' },
      paginate: false
    })
      .then((response) => {
        this.$data.switches = response.data
        console.log('loading all user virtual switch data')
      })
    switches.find({
      query: { type: 'view' },
      paginate: false
    })
      .then((response) => {
        this.$data.views = response.data
        this.$data.views.push({ name: 'all', _id: 'all' })
        console.log('loading all switch views', this.views[this.views.length - 1])
      })
// when should I use vuex instead of loading from server - might be better for realtime updates
    circuits.find({
      paginate: false
    })
      .then((response) => {
        this.$data.circuits = response.data
        console.log('circuits used for switches loaded', response.data)
      })
      .catch((err) => {
        console.log('error loading circuits', err)
      })

    // If another client has changed the state of virtual switch
    switches.on('patched', aswitch => {
      console.log(`changing switch ${aswitch.name}s state to ${this.state(aswitch)}`)
      // use lowdash array find method? lowdb or objectdb from tasktimer guy
      for (let i in this.switches) {
        if (this.switches[i]._id === aswitch._id) {
          this.switches[i].on = aswitch.on
          // Toast.create.info(`Circuit State Event => ${circuit.name} is now ${this.state(circuit)}`)
          return
        }
      }
    })
   // If another client has changed the state of virtual switch
    circuits.on('stateChanged', data => {
      console.log('circuit state changed', data)
    })
  }
}
</script>

<style lang="stylus">

@import '~variables'

.bulb
  background green

.view
  background $secondary
  width 100%

.on
    background $positive

.off
    background grey

.switch-on
   background green
   color red
.switch-off
   background $grey-5
   color $grey-8

</style>
