<template>
  <div class="error-page window-height window-width bg-light column items-center no-wrap">
  <h1>Access Denied - See System Administrator</h1>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.error-page
  .error-code
    height 50vh
    width 100%
    padding-top 15vh
    font-size 30vmax
    color rgba(255, 255, 255, .2)
    overflow hidden
  .error-card
    border-radius 2px
    margin-top -50px
    width 80vw
    max-width 600px
    padding 25px
    > i
      font-size 5rem
</style>
