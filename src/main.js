import { createVm } from '@/chronos'

const hasChronos = (vm, options) => [options.optionName] in vm.$options

const install = function (Vue, options) {
  options = options || {}
  options.getterName = options.getterName || '$chronos'
  options.optionName = options.optionName || 'chronos'

  Vue.mixin({
    data () {
      if (hasChronos(this, options)) {
        this._chronos = Vue.observable({instance: {}})

        this.$options.computed[options.getterName] = () => this._chronos.instance.userInterface
      }
      return {}
    },

    created () {
      if (hasChronos(this, options)) {
        this._chronos.instance = createVm(Vue, this, options)
      }
    },

    beforeDestroy () {
      if (hasChronos(this, options)) {
        this._chronos.instance.$destroy()
      }
    },
  })
}

export default { install }
