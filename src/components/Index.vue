<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" color="primary" class="">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
        v-show="adminmode"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        {{appName}}
        <div slot="subtitle">{{subTitle}}</div>
      </q-toolbar-title>

    <q-btn icon="settings" round color="primary" @click="adminMode()" v-show="isAuthenticated&&isAdmin&&!adminmode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Enter Admin Mode
      </q-tooltip>
    </q-btn>

    <q-btn icon="stop" round color="primary" @click="setAdminMode(false)" v-if="adminmode"  >
      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 20]">
       Exit Admin Mode
      </q-tooltip>
    </q-btn>

  </q-toolbar>

    <q-tabs v-model="selectedTab">
      <q-tab slot="title" name="tab-1" icon="message" />
      <q-tab slot="title" name="tab-2" icon="fingerprint" />
      <q-tab slot="title" name="tab-3" icon="account_box" />
    </q-tabs>



    <div slot="left"  v-if="adminmode">
      <!--
        Use <q-side-link> component 
        instead of <q-item> for 
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>Essential Links</q-list-header>
        <q-item @click="launch('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click="launch('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
          <q-item-side icon="chat" />
          <q-item-main label="Gitter Channel" sublabel="Quasar Lobby" />
        </q-item>
        <q-item @click="launch('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </div>


    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
  </q-layout>
</template>
<script>
// import { Toast } from 'quasar'
// import api from 'src/api'
import user from 'src/users'

import {
  Toast,
//  dom,
//  event,
//  openURL,
  QLayout,
  QToolbar,
  QTooltip,
  QTabs,
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
      appName: 'Lighting',
      subTitle: '645 Broadway',
      adminmode: false,
      admin: true,
      authenticated: true
    }
  },
  components: {
    QLayout,
    QToolbar,
    QTooltip,
    QTabs,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
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
