import {
  isObject,
  isFunction,
} from '../../../../src/utils/type-checker'

describe('Type checker', () => {
  it('isObject', () => {
    const object = {
      object: {},
      function: () => {},
      symbol: Symbol('symbol'),
      array: [],
    }

    expect(isObject(object.object))
      .toEqual(true)
    expect(isObject(object.function))
      .toEqual(false)
    expect(isObject(object.symbol))
      .toEqual(false)
    expect(isObject(object.array))
      .toEqual(false)
  })

  it('isFunction', () => {
    const object = {
      object: {},
      function: () => {},
      symbol: Symbol('symbol'),
      array: [],
    }

    expect(isFunction(object.function))
      .toEqual(true)
    expect(isFunction(object.object))
      .toEqual(false)
    expect(isFunction(object.symbol))
      .toEqual(false)
    expect(isFunction(object.array))
      .toEqual(false)
  })
})
