import { Toast, Dialog } from 'quasar'

export default {

  newDocument (text, doctype) {
    Dialog.create({
      title: text ? `${text}` : 'Add a database item',
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
            data.doctype = doctype
            this.create({'name': data.name, 'doctype': data.doctype})
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
