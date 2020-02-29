const isPlainObject = (object: object): boolean => Object.prototype.toString.call(object) === '[object Object]'

const isFunction = (object: () => any): boolean => Object.prototype.toString.call(object) === '[object Function]'

const isString = (value: string): boolean => typeof value === 'string'

export {
  isPlainObject,
  isFunction,
  isString,
}
