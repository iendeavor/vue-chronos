import {
  getByPath,
  setByPath,
} from '../../../../src/utils/path-manager'

describe('Path Manager', () => {
  it('getByPath with invalid', () => {
    const validObject = {
      nested1: {
        nested11: {
          value: 'value',
        },
      },
    }
    const validPath = 'nested1.nested11.value'
    const validSeparator = '.'
    const invalidObject = null
    const invalidPath = null
    const invalidSeparator = null
    const fallback = null

    expect(() => getByPath(invalidObject, validPath, fallback, validSeparator))
      .toThrow()
    expect(() => getByPath(validObject, invalidPath, fallback, validSeparator))
      .toThrow()
    expect(() => getByPath(validObject, validPath, fallback, invalidSeparator))
      .toThrow()
  })

  it('getByPath', () => {
    const object = {
      nested1: {
        nested11: {
          value: 'value',
        },
      },
    }

    const existentPath = 'nested1.nested11.value'
    const nonExistentPath1 = 'nested2'
    const nonExistentPath2 = 'nested2.nested21.value'

    const fallback = 'fallback'

    expect(getByPath(object, existentPath, fallback))
      .toEqual('value')

    expect(getByPath(object, nonExistentPath1, fallback))
      .toEqual(fallback)
    expect(getByPath(object, nonExistentPath2, fallback))
      .toEqual(fallback)
  })

  it('setByPath with invalid', () => {
    const validObject = {}
    const validPath = 'nested1.nested11.value'
    const validSeparator = '.'
    const invalidObject = null
    const invalidPath = null
    const invalidSeparator = null
    const value = null

    expect(() => setByPath(invalidObject, validPath, value, validSeparator))
      .toThrow()
    expect(() => setByPath(validObject, invalidPath, value, validSeparator))
      .toThrow()
    expect(() => setByPath(validObject, validPath, value, invalidSeparator))
      .toThrow()
  })

  it('setByPath', () => {
    const object = {}
    const path = 'nested1.nested11.value'
    const value = 'value'

    setByPath(object, path, value)
    expect(object.nested1.nested11.value)
      .toEqual('value')
  })
})
