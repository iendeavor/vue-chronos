import {
  isObject,
  isFunction,
} from '@/utils/type-checker'

describe('Type checker', () => {
  it('isObject', () => {
    const object = {
      object: {},
      function: () => {},
      symbol: Symbol('symbol'),
      array: [],
    }

    expect(isObject(object.object))
      .to.equal(true)
    expect(isObject(object.function))
      .to.equal(false)
    expect(isObject(object.symbol))
      .to.equal(false)
    expect(isObject(object.array))
      .to.equal(false)
  })

  it('isFunction', () => {
    const object = {
      object: {},
      function: () => {},
      symbol: Symbol('symbol'),
      array: [],
    }

    expect(isFunction(object.function))
      .to.equal(true)
    expect(isFunction(object.object))
      .to.equal(false)
    expect(isFunction(object.symbol))
      .to.equal(false)
    expect(isFunction(object.array))
      .to.equal(false)
  })
})
