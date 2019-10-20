import Vue from 'vue'
import Chronos from '@/../dist/vue-chronos'
Vue.use(Chronos)

describe('Chronos', () => {
  it('should install chronos correctly', () => {
    const vm = new Vue({
      chronos () { return [] },
    })
    expect(vm.$options.computed && vm.$options.computed.$chronos())
      .to.be.an('object')
    expect(vm.$chronos)
      .to.be.an('object')
  })
})
