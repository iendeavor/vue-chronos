import {
  deepCopy,
  dfs,
} from '../../../../src/utils/shared'

describe('shared', () => {
  it('deepCopy', () => {
    const object = {
      number: 1,
      bool: true,
      string: '123',
      object: {1: 2},
      array: [1, 2],
      null: null,
      // undefined: undefined,
    }

    expect(deepCopy(object))
      .toEqual(object)
    expect(deepCopy(object.number))
      .toEqual(object.number)
    expect(deepCopy(object.bool))
      .toEqual(object.bool)
    expect(deepCopy(object.string))
      .toEqual(object.string)
    expect(deepCopy(object.object))
      .toEqual(object.object)
    expect(deepCopy(object.array))
      .toEqual(object.array)
    expect(deepCopy(object.null))
      .toEqual(object.null)

    expect(deepCopy(object))
      .not.toBe(object)
    expect(deepCopy(object.object))
      .not.toBe(object.object)
    expect(deepCopy(object.array))
      .not.toBe(object.array)
  })
  it('dfs', () => {
    const object = {
      a1: {
        b1: {
          c1: {
            d1: 'd1',
          },
        },
      },
    }
    const callback = (value, key, object) => {
      result += key
    }
    let result = ''

    dfs(object, callback)
    expect(result)
      .toEqual('d1c1b1a1')
  })
})
