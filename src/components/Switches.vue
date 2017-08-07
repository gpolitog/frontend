<template>
<div>
  <!-- div>filter {{ filter }}</div -->
  <div v-if="filter === 'favorites'">Favorites</div>
  <div v-if="filter === '1st'">1st Floor</div>
  <div v-if="filter === '2nd'">2nd Floor</div>
  <div v-if="filter === 'outside'">Outside and Garage</div>
  <div v-if="filter === 'all'">All Switches</div>

  <q-btn rounded big @click="changeColor"  :color="btncolor">Rounded Push Button</q-btn>

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
      btncolor: String,
      checked: true,
      selections: ['goog']
    }
  },
  methods: {
    changeColor () {
      if (this.$data.btncolor === 'primary') {
        this.$data.btncolor = 'secondary'
      }
      else {
        this.$data.btncolor = 'primary'
      }
    }
  },
  props: ['filter'],
  mounted () {
    this.changeColor()
  }
}
</script>

<style>
</style>
