<template>
<div>
  <div class="col-12 view" >{{ viewName(views, curView) }}</div>
   <div class="xs-gutter" >
  <div class="row no-wrap aswitch" v-for="aswitch in filteredSwitches()" >
     <q-btn class="col-xs-8 col-sm-8 offset-md-2 col-md-6 offset-lg-4 col-lg-4" icon="fa-switch" rounded :class="state(aswitch)" @click="toggle(aswitch)" >{{aswitch.name}}
     </q-btn>
     <q-btn class="" rounded small @click="" >
       <q-icon name="fa-eye" />
       <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
         view circuits controlled by this switch
       </q-tooltip>
     </q-btn>
  </div>
  </div>

<q-fixed-position corner="bottom-right" :offset="[18, 18]" >
<q-fab
  @open="openFab()"
  @close="closeFab()"
  color="primary"
  icon="fa-list"
  active-icon="fa-list-alt"
  direction="up"
>
  <q-fab-action v-for="view in views" :key="view._id" color="secondary" @click="filter(view)" icon="fa-list">
    <q-tooltip ref="fabviewtp" anchor="center left" self="center right" :offset="[0, 0]">{{ view.name }}</q-tooltip>
  </q-fab-action>
</q-fab>
</q-fixed-position>

</div>
</template>

<script>

// TODO m

import api from 'src/api'
import _ from 'underscore'
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
    viewName (views, id) {
      if (_.findWhere(views, { '_id': id })) {  // initial issue where renders before this is ready.
        return _.findWhere(views, { '_id': id }).name
      }
      return 'Error!'
    },
    filteredSwitches () {
      if (this.curView !== 'all') {
        return _.filter(this.switches, aswitch => { return aswitch.views.indexOf(this.curView) !== -1 })
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
    },
    openFab () {
      if (this.$q.platform.has.touch) {
        setTimeout(() => {
          for (let index in this.$refs.fabviewtp) {
            this.$refs.fabviewtp[index].open()
          }
        }, 300)
      }
    },
    closeFab () {
      if (this.$q.platform.has.touch) {
        for (let index in this.$refs.fabviewtp) {
          this.$refs.fabviewtp[index].close()
        }
      }
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
        this.$data.views.push({ name: 'All', _id: 'all' })
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

.aswitch
  height: 50px

.bulb
  background green

.view
  background $secondary
  width 100%
  font-size 2em
  text-transform uppercase
  text-align center
  font-weight bold
  margin-bottom .2em
  padding .1em


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
