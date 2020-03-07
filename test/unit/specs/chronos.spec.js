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

  it('should throw with invalid config', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    new Vue({
      chronos: null
    })
    expect(console.error)
      .toBeCalled()

    spy.mockReset()
    new Vue({
      chronos: [
        ['a', 'b'],
        ['a', 'b'],
      ]
    })
    expect(console.error)
      .toBeCalled()

    spy.mockReset()
    new Vue({
      chronos: [
        null,
      ]
    })
    expect(console.error)
      .toBeCalled()

    spy.mockReset()
    new Vue({
      chronos: [
        ['a'],
      ]
    })
    expect(console.error)
      .toBeCalled()

    spy.mockReset()
    new Vue({
      chronos: [
        [null, null],
      ]
    })
    expect(console.error)
      .toBeCalled()
  })

  it('should works with promise', async () => {
    const vm = new Vue({
      data () {
        return {
          toInfluence: null,
          toBeInfluenced: null,
        }
      },
      chronos () {
        return [
          ['toInfluence', 'toBeInfluenced']
        ]
      }
    })
    let resolver
    const promise = new Promise(resolve => {
      resolver = resolve
    })

    expect(vm.$chronos.toInfluence.$pending)
      .toBe(false)
    expect(vm.$chronos.toBeInfluenced.$pending)
      .toBe(false)

    vm.$chronos.$load('toInfluence', promise)
    await Promise.resolve()
    await Promise.resolve()
    expect(vm.$chronos.toInfluence.$pending)
      .toBe(true)
    expect(vm.$chronos.toBeInfluenced.$pending)
      .toBe(true)

    resolver()
    await Promise.resolve()
    expect(vm.$chronos.toInfluence.$pending)
      .toBe(false)
    expect(vm.$chronos.toBeInfluenced.$pending)
      .toBe(false)
  })
})
