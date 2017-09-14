<script>

import api from 'src/api'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      device: this.pDevice[0],
      updated: false,
      deviceSettings: this.pDevice[1]
    }
  },
  render (element) {
    return element('div', {}, this.settingsForm(element))
  },
  props: ['pDevice'],
  computed: {
  },
  methods: {
    settingsForm (element) {
      let fields = []
      console.log('settings', this.device)
      for (let setting in this.device) {
        let field =
        element('q-field', {
          props: {
            label: this.deviceSettings[setting].label
          }
        }, [
          element('q-input', {
            props: {
              value: this.device[setting]
            },
            on: {
              input: e => {
                this.device[setting] = e.target.value
              }
            }
          })
        ]
        )// end element
        fields.push(field)
        console.log('field', setting, field)
      }// end settings loop
      console.log('fields', fields)
      return fields
    },

    updateDevice () {
      hardware.update(this.device._id, this.device)
      hardware.get(this.device._id).then(data => console.log('device as saved', data))
    }
  },
  watch: {

  },
  components: {
  },
  mounted () {

  }
}
</script>

<style lang="stylus">

@import '~variables'

.q-field-label
  color red

.q-field-content
    background $red-10

.q-input-target
    color blue



</style>
