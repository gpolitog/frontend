// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
// import Quasar from 'quasar'
import Quasar, {
//  dom,
//  event,
//  openURL,
  QLayout,
  QToolbar,
  QTooltip,
  QTab,
  QTabs,
  QTabPane,
  QRouteTab,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QSideLink,
  QItem,
  QItemSide,
  QItemMain,
  QFab,
  QFabAction,
  QFixedPosition
} from 'quasar'

Vue.use(Quasar, {
  components: {
    QLayout,
    QToolbar,
    QTooltip,
    QTab,
    QTabs,
    QRouteTab,
    QTabPane,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QSideLink,
    QItem,
    QItemSide,
    QItemMain,
    QFab,
    QFabAction,
    QFixedPosition
  }
})
// Vue.use(Quasar) // Install Quasar Framework

Vue.config.productionTip = false

import { sync } from 'vuex-router-sync'

import router from './router'
import store from './store'

sync(store, router) // done.

store.commit('increment')
console.log(store.state.count) // -> 1

// Required IE 11 polyfill
// import 'babel-polyfill'

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    data: {
      appName: '645 Lighting'
    },
    store,
    router,
    el: '#q-app',
    render: h => h(require('./App'))
  })
})
