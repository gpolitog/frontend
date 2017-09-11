<script>

import api from 'src/api'
const hardware = api.service('hardware')

export default {
  data () {
    return {
      device: this.pDevice,
      updated: false,
      deviceTypes: []
    }
  },
  render (element) {
    return element('q-field', {
      props: {
        label: 'a test label'
      }
    }, [
      element('q-input', {
        props: {
          value: this.device.name
        },
        on: {
          input: e => {
            this.device.desc = e.target.value
          }
        }
      }),
      element('h2', this.device.name)
    ])
  },
  props: ['pDevice'],
  computed: {
  },
  methods: {
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
