import Vue from 'vue'
import Chronos from '../../../dist/vue-chronos.esm.min.js'

Vue.use(Chronos)

describe('Chronos', () => {
  it('should install chronos correctly', () => {
    const vm = new Vue({
      chronos () { return [] },
    })
    expect(typeof vm.$options.computed.$chronos())
      .toBe('object')
    expect(typeof vm.$chronos)
      .toBe('object')
  })
})
