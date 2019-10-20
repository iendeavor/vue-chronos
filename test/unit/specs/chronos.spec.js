import Vue from 'vue'
import Chronos from '@/main.js'

Vue.use(Chronos, {
  optionName: 'chronos',
  getterName: '$chronos',
})

describe('Chronos', () => {
  it('would not create any chronos properties', () => {
    const vm = new Vue({})

    expect(vm.$options.computed && vm.$options.computed.$chronos)
      .to.be.an('undefined')
    expect(vm.$chronos)
      .to.be.an('undefined')
  })

  it('would create chronos properties', () => {
    const vm = new Vue({
      chronos () { return [] },
    })
    expect(vm.$options.computed && vm.$options.computed.$chronos())
      .to.be.an('object')
    expect(vm.$chronos)
      .to.be.an('object')

    const vm2 = new Vue({
      chronos: [],
    })
    expect(vm2.$options.computed && vm2.$options.computed.$chronos())
      .to.be.an('object')
    expect(vm2.$chronos)
      .to.be.an('object')
  })

  it('should destory chronos instance on beforeDestory', () => {
    const vm = new Vue({
      chronos: [],
    })
    expect(vm.$options.computed && vm.$options.computed.$chronos())
      .to.be.not.an('undefined')
    vm.$destroy()
    expect(vm.$options.computed && vm.$options.computed.$chronos())
      .to.be.an('undefined')
  })
})
