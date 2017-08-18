<template>
    <div>
        <div v-for="row in 3" class="row justify-center">
            <div v-for="col in 3" class="col-auto">
                <q-btn @click="handleClick((row-1)*3 + col)" :disabled="disabled">
                    {{ (row-1)*3 + col }}
                </q-btn>
            </div>
        </div>
        <q-input v-model="pin" clearable placeholder="PIN" class="pin-input"/>
    </div>
</template>

<script>
  import { QBtn, QInput, Toast } from 'quasar'

  const PIN_LENGT = 4
  // Just for demo purposes
  const CORRECT_PIN = '1234'

  export default {
    data () {
      return {
        pin: '',
        disabled: false
      }
    },
    methods: {
      handleClick (digit) {
        this.pin += digit
      },

      validatePin () {
        if (this.pin === CORRECT_PIN) {
          Toast.create.positive({ html: 'Correct PIN!' })
        }
        else {
          Toast.create.negative({ html: 'Wrong PIN!' })
        }

        this.reset()
      },

      reset () {
        this.pin = ''
        this.disabled = false
      }
    },
    watch: {
      pin (val) {
        if (val && val.length === PIN_LENGT) {
          this.disabled = true
          this.validatePin()
        }
      }
    },
    components: { QBtn, QInput }
  }
</script>

<style>
    .pin-input {
        width: 20%;
        margin: auto;
    }
</style>
