import {
  getByPath,
  setByPath,
} from '@/utils/path-manager'

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

    expect(() => getByPath({object: invalidObject, path: validPath, separator: validSeparator}))
      .to.throw()
    expect(() => getByPath({object: validObject, path: invalidPath, separator: validSeparator}))
      .to.throw()
    expect(() => getByPath({object: validObject, path: validPath, separator: invalidSeparator}))
      .to.throw()
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

    expect(getByPath({object, path: existentPath, fallback}))
      .to.equal('value')

    expect(getByPath({object, path: nonExistentPath1, fallback}))
      .to.equal(fallback)
    expect(getByPath({object, path: nonExistentPath2, fallback}))
      .to.equal(fallback)
  })

  it('setByPath with invalid', () => {
    const validObject = {}
    const validPath = 'nested1.nested11.value'
    const validSeparator = '.'
    const invalidObject = null
    const invalidPath = null
    const invalidSeparator = null

    expect(() => setByPath({object: invalidObject, path: validPath, separator: validSeparator}))
      .to.throw()
    expect(() => setByPath({object: validObject, path: invalidPath, separator: validSeparator}))
      .to.throw()
    expect(() => setByPath({object: validObject, path: validPath, separator: invalidSeparator}))
      .to.throw()
  })

  it('setByPath', () => {
    const object = {}
    const path = 'nested1.nested11.value'
    const value = 'value'

    setByPath({object, path, value})
    expect(object.nested1.nested11.value)
      .to.equal('value')
  })
})
