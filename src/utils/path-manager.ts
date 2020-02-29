import {
  isPlainObject,
  isString,
} from './type-checker'

const SEPARATOR = '.'

const getByPath = (object: object, path: string, fallback?: any): any => {
  if (isPlainObject(object) === false) throw Error(`${object} is not a plain Object`)
  if (isString(path) === false) throw Error(`${object} is not a valid Path`)

  try {
    const pathParts = path.split(SEPARATOR)
    const deepestPath = (pathParts.pop() as string)

    let currentObject: any = object
    pathParts.forEach(pathPart => { currentObject = currentObject[pathPart] })
    return currentObject.hasOwnProperty(deepestPath) ? currentObject[deepestPath] : fallback
  } catch (error) {
    return fallback
  }
}

const setByPath = (object: object, path: string, value: any): void => {
  if (isPlainObject(object) === false) throw Error(`${object} is not a plain Object`)
  if (isString(path) === false) throw Error(`${object} is not a valid Path`)

  const pathParts = path.split(SEPARATOR)
  const deepestPath: string = (pathParts.pop() as string)

  let currentObject: any = object
  pathParts.forEach(pathPart => {
    if ((currentObject.hasOwnProperty(pathPart)) === false) currentObject[pathPart] = {}
    currentObject = currentObject[pathPart]
  })
  currentObject[deepestPath] = typeof value === 'function' ? value() : value
}

export {
  getByPath,
  setByPath,
}
