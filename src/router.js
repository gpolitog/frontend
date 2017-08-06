import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

function loadConfig (component) {
  return () => System.import(`components/config/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    {
      path: '/',
      name: 'index',
      component: load('Index'),
      children: [
        {
          path: '/config',
          name: 'config',
          component: loadConfig('Index')
        },
        {
          path: '/config/core',
          name: 'config-core',
          component: loadConfig('Core')
        },
        {
          path: '/config/switches',
          name: 'config-switches',
          component: loadConfig('Switches')
        },
        {
          path: '/config/lights',
          name: 'config-lights',
          component: loadConfig('Lights')
        },
        {
          path: '/config/users',
          name: 'config-users',
          component: loadConfig('Users')
        },
        {
          path: '/switches/:filter',
          props: true,
          component: load('Switches')
        }
      ]
    },
    {
      path: '/denied',
      name: 'denied',
      component: load('Denied')
    },
    {
      path: '*',
      component: load('Error404')
    } // Not found
  ]
})
