import {
  deepCopy,
  dfs,
} from '@/utils/shared'

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
      .to.eql(object)
    expect(deepCopy(object.number))
      .to.eql(object.number)
    expect(deepCopy(object.bool))
      .to.eql(object.bool)
    expect(deepCopy(object.string))
      .to.eql(object.string)
    expect(deepCopy(object.object))
      .to.eql(object.object)
    expect(deepCopy(object.array))
      .to.eql(object.array)
    expect(deepCopy(object.null))
      .to.eql(object.null)
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
      .to.equal('d1c1b1a1')
  })
})
