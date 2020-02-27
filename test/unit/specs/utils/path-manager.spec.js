import {
  getByPath,
  setByPath,
} from '../../../../src/utils/path-manager'

describe('Path Manager', () => {
  it('getByPath with invalid', () => {
    const validObject = {
      nested1: {
        nested2: {
          value: {},
        },
      },
    }
    const validPath = 'nested1.nested2.value'
    const invalidObject = null
    const invalidPath = null

    expect(() => getByPath(invalidObject, validPath))
      .toThrow()
    expect(() => getByPath(validObject, invalidPath))
      .toThrow()
  })

  it('getByPath', () => {
    const object = {
      nested1: {
        nested2: {
          value: {},
        },
      },
    }
    const fallback = {}
    const existentPath = 'nested1.nested2.value'
    const nonExistentPath1 = 'nested3'
    const nonExistentPath2 = 'nested1.nested3.value'

    expect(getByPath(object, existentPath))
      .toBe(object.nested1.nested2.value)

    expect(getByPath(object, nonExistentPath1, fallback))
      .toBe(fallback)
    expect(getByPath(object, nonExistentPath2, fallback))
      .toBe(fallback)
  })

  it('setByPath with invalid', () => {
    const validObject = {}
    const validPath = 'nested1.nested2.value'
    const invalidObject = null
    const invalidPath = null
    const value = null

    expect(() => setByPath(invalidObject, validPath, value))
      .toThrow()
    expect(() => setByPath(validObject, invalidPath, value))
      .toThrow()
  })

  it('setByPath', () => {
    const object = {}
    const path = 'nested1.nested2.value'
    const value = {}

    setByPath(object, path, value)
    expect(object.nested1.nested2.value)
      .toBe(value)
  })
})
