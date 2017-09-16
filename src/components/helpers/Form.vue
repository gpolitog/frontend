<script>

// import makeFieldProps from '../helpers/makeFieldProps.js'

export default {
  data () {
    return {
    }
  },
  render (element) {
    return element('div', {}, this.makeForm(element))
  },
  props: ['values', 'schema'],
  methods: {
    makeForm (element) {
      let form = []
      console.log('values', this.values)
      // here is where one could init keys instead of in back end
      for (let key in this.schema) {
        let field =
        element('q-field', {
          props: {
            label: this.schema[key].fieldProps.label
          }
        }, [
          element(this.schema[key].fieldType ? `q-${this.schema[key].fieldType}` : 'q-input', {
            props: this.fieldProps(this.values[key], this.schema[key]),
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
    },
    fieldProps (value, field) {
      let props = field.fieldProps
      // let props = makeFieldProps[ field.fieldType ? field.fieldType : 'input' ](field)
      console.log('props after processing', props)
      props.value = value
      return props
    }
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
