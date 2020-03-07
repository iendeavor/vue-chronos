import {
  isPlainObject,
  isFunction,
  isString,
} from '../../../../src/utils/type-checker'

describe('Type checker', () => {
  it('isPlainObject', () => {
    function UserDefined () {}

    const trueValues = [
      {},
    ]
    for (const value of trueValues) {
      expect(isPlainObject(value)).toEqual(true)
    }

    const falseValues = [
      new UserDefined(),
      Object.create(null),
      [],
      null,
      undefined,
    ]
    for (const value of falseValues) {
      expect(isPlainObject(value)).toEqual(false)
    }
  })

  it('isFunction', () => {
    function UserDefined () {}

    const trueValues = [
      () => {},
      UserDefined,
    ]
    for (const value of trueValues) {
      expect(isFunction(value)).toEqual(true)
    }

    const falseValues = [
      null,
      undefined,
    ]
    for (const value of falseValues) {
      expect(isFunction(value)).toEqual(false)
    }
  })

  it('isString', () => {
    const trueValues = [
      '',
      'string',
    ]
    for (const value of trueValues) {
      expect(isString(value)).toEqual(true)
    }

    const falseValues = [
      null,
      undefined,
    ]
    for (const value of falseValues) {
      expect(isString(value)).toEqual(false)
    }
  })
})
