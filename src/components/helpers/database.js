import { Toast, Dialog } from 'quasar'

export default {

  newDocument (text) {
    Dialog.create({
      title: `Create New Document in DB ${text}`,
      form: {
        name: {
          type: 'text',
          label: 'Name',
          model: ''
        }
      },
      buttons: [
        {
          label: 'create',
          handler: (data) => {
            this.create({'name': data.name})
          .then(response => {
            console.log('created document record ', response._id)
            Toast.create.positive('new entry created')
            return response._id
          })
          .catch(err => {
            console.log('create error', err)
            Toast.create.negative(err, ' - Try Again')
          })
          }
        }
      ]
    })
  }
}
