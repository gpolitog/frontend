<template>
<div>
  <!-- div>filter {{ filter }}</div -->
  <div v-if="filter === 'favorites'">Favorites</div>
  <div v-if="filter === '1st'">1st Floor</div>
  <div v-if="filter === '2nd'">2nd Floor</div>
  <div v-if="filter === 'outside'">Outside and Garage</div>
  <div v-if="filter === 'all'">All Switches</div>

  <q-btn rounded big :class="switchColor" @click="toggleSwitch()" >Rounded Button</q-btn>

  <q-field icon="fa-lightbulb-o" label="Associated Lights">
    <q-select v-model="btncolor" color="primary" :options="selectOptions" @change="inputChange" />
  </q-field>

  <q-toggle v-model="checked" color="red" />

  <q-dialog-select multiple toggle v-model="selections" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles" />

</div>
</template>

<script>
export default {
  data () {
    return {
      selectOptions: [{
        label: 'Primary',
        value: 'primary'
      },
      {
        label: 'Secondary',
        value: 'secondary'
      }
      ],
      swon: false,
      checked: true,
      selections: ['goog']
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
