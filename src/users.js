// computed helper functions for checking user authentification and access
import { Toast, Dialog } from 'quasar'
// import { Toast } from 'quasar'
// import Dialog from 'src/components/helpers/dialog'

export default {
    //  both users and administrators
  authenticated () {
    console.log('user authenticated ', this.$data.authenticated)
    return this.$data.authenticated
  },

  authenticate: (mode) => {
    if (mode) {
      return Promise.resolve()
    }
    else {
      return Promise.reject()
    }
  },

  admin () {
    console.log('user is administrator ', this.$data.admin)
    return this.$data.admin
  },

// and administrator can enter admin mode for making system changes with a pin/pw
//  adminMode () {
//    console.log('admin mode is ', this.$data.adminmode)
//    return this.$data.adminmode
//  },

  exitConfigMode () {
    this.$data.configMode = false
    Toast.create.info('Exited Administrator Mode')
    console.log('configuration mode set to ', this.configMode)
    this.$router.push({ path: '/switches' })
  },

  confirmAdminPin (pin) {
//     return api.authenticate({
//        strategy: 'local',
//        password: pin     })
    console.log('entered pin was', pin)
    if (pin === '1') {
      console.log('correct pin entered')
      return Promise.resolve()
    }
    else {
      return Promise.reject('wrong pin')
    }
  },

  verifyAdminNew () {
    Dialog.create({
      title: 'Enter Configuration Mode',
      form: {
        pin: {
          type: 'pin',
          label: 'Pin',
          model: ''
        }
      },
      buttons: [
        {
          label: 'Ok',
          handler: (data) => {
            this.confirmAdminPin(data.pin)
            .then(_ => {
              this.$data.configMode = true
              console.log('config mode set by dialog ', this.$data.configMode)
              Toast.create.info('You are now in configuration mode')
              this.$router.push({ path: '/config' })
            })
            .catch(err => {
              this.$data.configMode = false
              Toast.create.negative(err, ' - Try Again')
            })
          }
        }
      ]
    })
  },

  verifyAdmin () {
    Dialog.create({
      title: 'Enter Configuration Mode',
      form: {
        pin: {
          type: 'password',
          label: 'Pin',
          model: ''
        }
      },
      buttons: [
        {
          label: 'Ok',
          handler: (data) => {
            this.confirmAdminPin(data.pin)
            .then(_ => {
              this.$data.configMode = true
              console.log('admin mode set by dialog ', this.configMode)
              Toast.create.info('You are now in configuration mode')
              this.$router.push({ path: '/config' })
            })
            .catch(err => {
              this.$data.configMode = false
              Toast.create.negative(err, ' - Try Again')
            })
          }
        }
      ]
    })
  }
}
