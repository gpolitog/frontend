<template>
  <q-layout
    ref="layout"
    view="Hhh lpr fff"
    :left-class="{'bg-secondary': true}"
  >
    <q-toolbar slot="header" :color="toolbarColor" class="" >
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

      <q-toolbar-title>
        {{appName}}
        <!-- div slot="subtitle">{{subTitle}}</div -->
      </q-toolbar-title>
      <q-btn icon="stop" small color="secondary" round @click="exitConfigMode()" v-show="configMode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Exit Configuration Mode
      </q-tooltip>
    </q-btn>

    <q-btn class="" icon="fa-key" small round @click="verifyAdmin()" v-show="isAuthenticated&&isAdmin&&!configMode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Enter Configuration Mode - Requires Administrator Pin
      </q-tooltip>
    </q-btn>

  </q-toolbar>


  <div slot="left"  v-if="configMode">
    <q-list no-border link inset-separator>
      <q-list-header>System Configuration</q-list-header>
      <q-side-link item to="/config/hardware">
        <q-item-side icon="settings" />
        <q-item-main label="Hardware" sublabel="Real-time Controlled Hardware" />
      </q-side-link>
      <q-side-link item to="/config/switches">
        <q-item-side icon="fa-toggle-on" />
        <q-item-main label="Switches" sublabel="Physical and Virtual" />
      </q-side-link>
      <q-side-link item to="/config/circuits">
          <q-item-side icon="fa-lightbulb-o" />
          <q-item-main label="Circuits" sublabel="Lights/Outlets" />
      </q-side-link>
      <q-side-link item to="/config/security">
          <q-item-side icon="fa-tablet" />
          <q-item-main label="Security" sublabel="grant access to system" />
      </q-side-link>
      <q-side-link item to="/config/backup" >
          <q-item-side icon="fa-save" />
          <q-item-main label="Backup" sublabel="commit or restore configurations" />
      </q-side-link>
      <q-side-link item to="/config" >
          <q-item-side icon="fa-info-circle" />
          <q-item-main label="Help" sublabel="info on configuring system" />
      </q-side-link>
      <q-item @click="exitConfigMode()">
        <q-item-side icon="stop" />
        <q-item-main label="Exit" sublabel="exit configuration mode" />
      </q-item>
    </q-list>
  </div>

  <router-view />

  </q-layout>
</template>
<script>
// import { Toast } from 'quasar'
// import api from 'src/api'
import user from '../users'
import pinPad from './helpers/Pinpad.vue'

export default {
  data () {
    return {
      appName: 'Lighting - 645 Broadway',
      subTitle: '645 Broadway',
      configMode: true,
      admin: true,
      authenticated: true,
      tbc: 'red'
    }
  },
  components: {
    pinPad
  },
  computed: {
    isAuthenticated: user.authenticated,
    isAdmin: user.admin,
    toolbarColor: function () {
      if (!this.configMode) {
        return 'primary'
      }
      else {
        return 'negative'
      }
    }
  },
  methods: {
    filterSwitches (filter) {
      // filter = 'switches/' + filter
      this.$router.push({ path: filter })
    },
    exitConfigMode: user.exitConfigMode,
    confirmAdminPin: user.confirmAdminPin,
    verifyAdmin: user.verifyAdmin
  },
  beforeMount () {
    user.authenticate(this.$data.authenticated)
    .then((response) => {
      this.$router.push({ path: '/switches' })
    })
    .catch(_ => {
      this.$router.push({ name: 'denied' })
    })
  },
  mounted () {
    // this.$router.push({ path: '/config/hardware' })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="styl">
q-toolbar-title
  padding: .2em

</style>
