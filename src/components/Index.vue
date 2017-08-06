<template>
  <q-layout
    ref="layout"
    view="Hhh lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" color="primary" class="">
      <q-btn
        flat
        icon="menu"
        @click="$refs.layout.toggleLeft()"
        v-show="configMode"
      >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Configuration Options
      </q-tooltip>
      </q-btn>

    <q-btn icon="fa-key" small round @click="verifyAdmin()" v-show="isAuthenticated&&isAdmin&&!configMode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Enter Configuration Mode - Requires Administrator Pin
      </q-tooltip>
    </q-btn>

      <q-toolbar-title>
        {{appName}}
        <div slot="subtitle">{{subTitle}}</div>
      </q-toolbar-title>

    <q-btn icon="stop" small round @click="exitConfigMode()" v-if="configMode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Exit Configuration Mode
      </q-tooltip>
    </q-btn>

  </q-toolbar>

    <q-tabs slot="navigation" align="center" v-if="!configMode" color="secondary" >
    <q-route-tab
      default
      icon="fa-heart"
      to="/switches/favorites"
      exact
      slot="title"
    />
    <q-route-tab
      label="all"
      to="/switches/all"
      exact
      slot="title"
    />
  </q-tabs>


  <div slot="left"  v-if="configMode">
    <q-list no-border link inset-separator>
      <q-list-header>System Configuration</q-list-header>
      <q-side-link item to="/config/core">
        <q-item-side icon="settings" />
        <q-item-main label="Core" sublabel="Hardware/Software" />
      </q-side-link>
      <q-side-link item to="/config/switches">
        <q-item-side icon="fa-toggle-on" />
        <q-item-main label="Switches" sublabel="Physical and Virtual" />
      </q-side-link>
      <q-side-link item to="/config/lights">
          <q-item-side icon="fa-lightbulb-o" />
          <q-item-main label="Lights" sublabel="Circuits/Loads" />
      </q-side-link>
      <q-side-link item to="/config/users">
          <q-item-side icon="fa-user-circle" />
          <q-item-main label="Users" sublabel="add/edit user devices" />
      </q-side-link>
    </q-list>
  </div>

<q-fixed-position corner="bottom-right" :offset="[18, 18]">
    <q-btn icon="fa-key" small round @click="verifyAdmin()" v-show="isAuthenticated&&isAdmin&&!configMode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Enter Configuration Mode - Requires Administrator Pin
      </q-tooltip>
    </q-btn>
</q-fixed-position>

  <router-view /> 

  </q-layout>
</template>
<script>
// import { Toast } from 'quasar'
// import api from 'src/api'
import user from 'src/users'

export default {
  data () {
    return {
      appName: 'Lighting',
      subTitle: '645 Broadway',
      configMode: false,
      admin: true,
      authenticated: true,
      tbc: 'red'
    }
  },
  components: {
  },
  computed: {
    isAuthenticated: user.authenticated,
    isAdmin: user.admin,
    toolbarColor: _ => {
      if (!this.$data.configMode) {
        return 'green'
      }
      else {
        return 'red-2'
      }
    }
  },
  methods: {
    goTo (route) {
      this.$router.push({ name: route })
    },
    exitConfigMode: user.exitConfigMode,
    confirmAdminPin: user.confirmAdminPin,
    verifyAdmin: user.verifyAdmin
  },
  beforeMount () {
    user.authenticate(this.$data.authenticated)
    .then((response) => {
      this.$router.push({ path: '/switches/favorites' })
    })
    .catch(_ => {
      this.$router.push({ name: 'denied' })
    })
  },
  mounted () {
    // this.$router.push({ path: '/switches/favorites' })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">

</style>
