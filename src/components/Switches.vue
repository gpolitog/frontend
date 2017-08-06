<template>
 <div>
 <!-- div>filter {{ filter }}</div -->
 <div v-if="filter === 'favorites'">Favorites</div>
<div v-if="filter === '1st'">1st Floor</div>
<div v-if="filter === '2nd'">2nd Floor</div>
<div v-if="filter === 'outside'">Outside and Garage</div>
<div v-if="filter === 'all'">All Switches</div>
 </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  props: ['filter'],
  mounted () {
  }
}
</script>

<style>
</style>
