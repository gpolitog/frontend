<template>
  <q-layout>
    <div slot="header" class="toolbar">

      <button @click="$refs.menu.open()" v-show="adminmode">
        <i>menu</i>
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Menu</q-tooltip>
      </button>

      <q-toolbar-title :padding="0">
        Home Lighting
      </q-toolbar-title>

      <!-- button class="primary circular" setAdminMode(true) @click="goTo('admin')" v-show="!adminMode" -->
      <button class="primary circular" @click="adminMode()" v-show="isAuthenticated&&isAdmin&&!adminmode" >
        <i>settings</i>
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Enter Admin Mode</q-tooltip>
      </button>
       <button class="primary circular" @click="setAdminMode(false)" v-if="adminmode">
        <i>stop</i>
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">Exit Admin Mode</q-tooltip>
      </button>
  
      
      <!--q-tabs slot="navigation">
        <q-tab route="/singin" exact replace>Sign In</q-tab>
        <q-tab route="/singup" exact replace>Register</q-tab>
        <q-tab icon="featured_play_list" route="/chat" exact replace>Your Tasks</q-tab>
      </q-tabs-->

    </div>

<!-- admin-mode :admin="true"  v-if="adminDialog"></admin-mode -->
    
    <!-- system settings menu admin only -->
    <q-drawer swipe-only left-side ref="menu" >
      <div class="toolbar light">
        <i>menu</i>
        <q-toolbar-title :padding="1">
            Admin Menu
        </q-toolbar-title>
      </div>

      <q-drawer-link icon="" to="/system">System</q-drawer-link>
      <q-drawer-link icon="" to="/loads">Loads</q-drawer-link>

    </q-drawer>

    <!-- sub-routes -->
    <router-view class="layout-view"></router-view>
    
  </q-layout>
</template>
<script>
// import { Toast } from 'quasar'
// import api from 'src/api'
import user from 'src/users'

import {
  Toast,
  dom,
  event,
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'

export default {
  data () {
    return {
      adminmode: false,
      admin: true,
      authenticated: true
    }
  },
  components: {
  },
  computed: {
    isAuthenticated: user.authenticated,
    isAdmin: user.admin
  },
  methods: {
    goTo (route) {
      this.$router.push({ name: route })
    },
    setAdminMode: user.setAdminMode,
    confirmAdminPin: user.confirmPin,
    adminMode: user.adminMode
  },
  mounted () {
    user.authenticate()
    .then((response) => {
      Toast.create.positive('User Authenticated')
      this.$router.push({ name: 'home' })
    })
    .catch(_ => {
      Toast.create.negative('See Administrator for System Access')
      this.$router.push({ name: 'home' })
    })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">

</style>
