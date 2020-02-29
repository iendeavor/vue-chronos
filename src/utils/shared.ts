import {
  isPlainObject,
} from './type-checker'

type StringifyablePrimitive = string | number | boolean | StringifyablePrimitive[]
interface StringifyableObject { [propName: string]: StringifyablePrimitive | StringifyableObject }
const deepCopy = (object: StringifyablePrimitive | StringifyableObject) => {
  return JSON.parse(JSON.stringify(object))
}

type DfsCallback = (value: any, key: string, object: any, isRoot: boolean) => void
const dfs = (object: any, callback: DfsCallback): void => {
  _dfs({'': object}, callback)
}
const _dfs = (object: object, callback: DfsCallback, isRoot: boolean = true): void => {
  const currentObject: any = object
  Object.keys(object).forEach(key => {
    if (isPlainObject(currentObject[key])) {
      _dfs(currentObject[key], callback, false)
    }
    callback(currentObject[key], key, object, isRoot)
  })
}

export {
  deepCopy,
  dfs,
}
