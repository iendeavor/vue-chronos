import {
  isPlainObject,
  isFunction,
} from '../../../../src/utils/type-checker'

describe('Type checker', () => {
  it('isPlainObject', () => {
    const object = {
      object: {},
      function: () => {},
      symbol: Symbol('symbol'),
      array: [],
    }

    expect(isPlainObject(object.object))
      .toEqual(true)
    expect(isPlainObject(object.function))
      .toEqual(false)
    expect(isPlainObject(object.symbol))
      .toEqual(false)
    expect(isPlainObject(object.array))
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
