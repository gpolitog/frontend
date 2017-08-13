<template>
<div>
  <!-- div>filter {{ filter }}</div -->
  <div v-if="filter === 'favorites'">Favorites</div>
  <div v-if="filter === '1st'">1st Floor</div>
  <div v-if="filter === '2nd'">2nd Floor</div>
  <div v-if="filter === 'outside'">Outside and Garage</div>
  <div v-if="filter === 'all'">All Switches</div>

  <div v-for="aswitch in switches" >
 <q-btn rounded big :class="switchColor" @click="toggleSwitch()" >{{aswitch.name}}</q-btn>
  </div>

 


</div>
</template>

<script>
import api from 'src/api'

export default {
  data () {
    return {
      switches: []
    }
  },
  computed: {
    switchColor: function () {
      console.log('computed class', this.$data.swon)
      if (this.$data.swon) {
        return 'switch-on'
      }
      else {
        return 'switch-off'
      }
    }
  },
  methods: {
    toggleSwitch () {
      console.log('toggling switch', this.$data.swon)
      this.$data.swon = !this.$data.swon
    }
  },
  props: ['filter'],
  mounted () {
    const switches = api.service('switches')
    console.log('load in switch data')
    switches.find({
      query: { doctype: 'switch' }
    })
      .then((response) => {
        this.$data.switches = response.data
        console.log('from server', response.data[0].name)
      })

    // Add new messages to the message list
    switches.on('updated', data => {
      console.log('switch status updated', data)
    })
  }
}
</script>

<style lang="stylus">

@import '~variables'

.switch-on
   background green
   color red
.switch-off
   background $grey-5
   color $grey-8

</style>
