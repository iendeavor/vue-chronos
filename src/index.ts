import { createVm } from './chronos'

import {
  Options
} from './types/vue'

const hasChronos = (vm: Vue, options: Options) => options.optionName in vm.$options

const install = function (Vue, options: Options = { getterName: '$chronos', optionName: 'chronos' }) {
  // istanbul ignore next
  options.getterName = options.getterName || '$chronos'
  // istanbul ignore next
  options.optionName = options.optionName || 'chronos'

  Vue.mixin({
    data () {
      if (hasChronos(this, options)) {
        this._chronos = Vue.observable({instance: {}})

        this.$options.computed = this.$options.computed || {}
        this.$options.computed[options.getterName] = () => {
          return (
            this._chronos &&
            this._chronos.instance &&
            this._chronos.instance.userInterface
          )
        }
      }
      return {}
    },

    created () {
      if (hasChronos(this, options)) {
        this._chronos.instance = createVm(Vue, this, options)
      }
    },

    destroyed () {
      if (hasChronos(this, options)) {
        this._chronos && this._chronos.instance && this._chronos.instance.$destroy()
        delete this._chronos
      }
    },
  })
}

export default { install }
