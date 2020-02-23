import {
  isObject,
} from './type-checker'

let __defaultSeparator = '.'

const isValidPath = value => typeof value === 'string'
const isValidSeparator = value => typeof value === 'string' && value !== ''

const getByPath = (object, path, fallback = undefined, separator = __defaultSeparator) => {
  if (isObject(object) === false) throw Error(`${object} is not a plain Object`)
  if (isValidPath(path) === false) throw Error(`${object} is not a valid Path`)
  if (isValidSeparator(separator) === false) throw Error(`${object} is not a valid Separator`)

  return __getByPath(object, path, fallback, separator)
}
const __getByPath = (object, path, fallback = undefined, separator = __defaultSeparator) => {
  try {
    const pathParts = path.split(separator)
    const deepestPath = pathParts.pop()
    pathParts.forEach(pathPart => { object = object[pathPart] })
    return deepestPath in object ? object[deepestPath] : fallback
  } catch (error) {
    return fallback
  }
}

const setByPath = (object, path, value, separator = __defaultSeparator) => {
  if (isObject(object) === false) throw Error(`${object} is not a plain Object`)
  if (isValidPath(path) === false) throw Error(`${object} is not a valid Path`)
  if (isValidSeparator(separator) === false) throw Error(`${object} is not a valid Separator`)

  return __setByPath(object, path, value, separator)
}
const __setByPath = (object, path, value, separator = __defaultSeparator) => {
  const pathParts = path.split(separator)
  const deepestPath = pathParts.pop()
  pathParts.forEach(pathPart => {
    if ((pathPart in object) === false) object[pathPart] = {}
    object = object[pathPart]
  })

  object[deepestPath] = typeof value === 'function' ? value() : value
}

export {
  getByPath,
  setByPath,
}
