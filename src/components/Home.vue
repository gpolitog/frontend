<template>
     <div class="layout-padding">
      <div class="column items-center"> 
      <h1>Home Page</h1> 
        <div v-if="isAuthenticated">
          <div v-if="isAdmin">
               <p> admin user </p>
            <div v-if="isAdminMode">
               <p> in admin mode </p>
            </div>
            </div>
          <div v-else >
          <p> authenticated user </p>
         </div>
       </div>
       <div v-else >
       <p> See system administrator for how authenticate on system </p>
       </div>
    </div>
  </div>
</template>

<script>
import user from 'src/users'

export default {
  data () {
    return {
    }
  },
  computed: {
    isAuthenticated: user.authenticated,
    isAdmin: user.admin,
    isAdminMode: user.adminMode
  },
  methods: {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">

</style>
