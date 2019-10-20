import { isObject } from './type-checker'

const deepCopy = object => {
  if (isObject(object)) {
    return JSON.parse(JSON.stringify(object))
  } else {
    return object
  }
}
const dfs = (object, callback) => {
  _dfs({'': object}, callback)
}

const _dfs = (object, callback, isRoot = true) => {
  if (isObject(object)) {
    Object.keys(object).forEach(key => {
      if (isObject(object[key])) {
        _dfs(object[key], callback, false)
      }
      callback(object[key], key, object, isRoot)
    })
  }
}

export {
  deepCopy,
  dfs,
}
