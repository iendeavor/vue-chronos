import {
  isPlainObject,
} from './type-checker'

const SEPARATOR = '.'

const isValidPath = value => typeof value === 'string'

const getByPath = (object, path, fallback = undefined) => {
  if (isPlainObject(object) === false) throw Error(`${object} is not a plain Object`)
  if (isValidPath(path) === false) throw Error(`${object} is not a valid Path`)

  try {
    const pathParts = path.split(SEPARATOR)
    const deepestPath = pathParts.pop()
    pathParts.forEach(pathPart => { object = object[pathPart] })
    return deepestPath in object ? object[deepestPath] : fallback
  } catch (error) {
    return fallback
  }
}

const setByPath = (object, path, value) => {
  if (isPlainObject(object) === false) throw Error(`${object} is not a plain Object`)
  if (isValidPath(path) === false) throw Error(`${object} is not a valid Path`)

  const pathParts = path.split(SEPARATOR)
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
