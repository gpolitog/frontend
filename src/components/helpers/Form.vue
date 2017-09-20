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
      // console.log('values', this.values)
      for (let key in this.schema) {
        // here is where one could init keys instead of in back end
        if (this.schema[key].fieldType !== 'hidden') {
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
            }),
            this.tooltip(this.schema[key].fieldProps.tip, element)
          ]
          )// end field element
          form.push(field)
        } // skip for hidden
        // console.log('field', key, field)
      }// end form field loop
      // console.log('the form object', form)
      return form
    },
    fieldProps (value, field) {
      let props = field.fieldProps // quasar compenent props here
      // let props = makeFieldProps[ field.fieldType ? field.fieldType : 'input' ](field)
      // console.log('props after processing', props)
      props.value = value
      return props
    },
    tooltip (tip, e) {
      if (tip) {
        return e('q-tooltip', {}, [ tip ])
      }
      else {
        return null
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus">

@import '~variables'

</style>
