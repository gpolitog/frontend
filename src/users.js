// computed helper functions for checking user authentification and access
import { Toast, Dialog } from 'quasar'

export default {
    //  both users and administrators
  authenticated () {
    console.log('user authenticated ', this.$data.authenticated)
    return this.$data.authenticated
  },

  authenticate: _ => {
    return Promise.resolve('authenticated')
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

  setAdminMode (mode) {
    this.$data.adminmode = mode
    if (!this.$data.adminmode) {
      Toast.create.positive('Exited Administrator Mode')
    }
    console.log('admin mode set to ', this.$data.adminmode)
  },

  confirmPin (pin) {
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

  adminMode () {
    Dialog.create({
      title: 'Enter Administrator Mode',
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
              this.setAdminMode(true)
              console.log('admin mode set by dialog ', this.$data.adminmode)
              Toast.create.positive('You are now in admin mode', this.$data.adminmode)
            })
            .catch(err => {
              // this.$data.adminmode = false
              Toast.create.negative(err, ' - Try Again')
            })
          }
        }
      ]
    })
  }
}
