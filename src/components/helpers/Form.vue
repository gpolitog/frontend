<script>

export default {
  data () {
    return {
  //    values: this.valuesNschema[0],
   //   updated: false,
  //    schema: this.valuesNschema[1]
    }
  },
  render (element) {
    return element('div', {}, this.makeForm(element))
  },
  props: ['values', 'schema'],
  computed: {
  },
  methods: {
    makeForm (element) {
      let form = []
      console.log('values', this.values)
      for (let key in this.values) {
        let field =
        element('q-field', {
          props: {
            label: this.schema[key].label
          }
        }, [
          element(this.values[key].fieldType ? `q-${this.schema[key].fieldType}` : 'q-input', {
            props: {
// put function here to get props given quasar form field types
              value: this.values[key]
            },
            on: { input: (value) => {
              this.values[key] = value
              this.$emit('input', { name: key, value: value })
            }
            }
          })
        ]
        )// end field
        form.push(field)
        // console.log('field', key, field)
      }// end form field loop
      // console.log('the form object', form)
      return form
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
