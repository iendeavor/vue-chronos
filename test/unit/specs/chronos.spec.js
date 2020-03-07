import Vue from 'vue'
import Chronos from '../../../src/index'

Vue.use(Chronos)

describe('Chronos', () => {
  it('would not create any chronos properties', () => {
    const vm = new Vue({})

    expect(vm.$options.computed)
      .toBeUndefined()
    expect(vm.$chronos)
      .toBeUndefined()
  })

  it('would create chronos properties', () => {
    const vm = new Vue({
      chronos () { return [] },
    })
    expect(typeof vm.$options.computed.$chronos())
      .toBe('object')
    expect(typeof vm.$chronos)
      .toBe('object')

    const vm2 = new Vue({
      chronos: [],
    })
    expect(typeof vm2.$options.computed.$chronos())
      .toBe('object')
    expect(typeof vm2.$chronos)
      .toBe('object')
  })

  it('should destory chronos instance on beforeDestory', () => {
    const vm = new Vue({
      chronos: [],
    })
    expect(vm.$options.computed.$chronos())
      .not.toBeUndefined()
    vm.$destroy()
    expect(vm.$options.computed.$chronos())
      .toBeUndefined()
  })
})
