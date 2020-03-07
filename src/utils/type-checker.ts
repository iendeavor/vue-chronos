const isPlainObject = (object: object): boolean => (
  object !== void 0 &&
  object !== null &&
  Object.getPrototypeOf(object) !== null &&
  Object.getPrototypeOf(object).constructor === Object
)

const isFunction = (object: () => any): boolean => Object.prototype.toString.call(object) === '[object Function]'

const isString = (value: string): boolean => typeof value === 'string'

export {
  isPlainObject,
  isFunction,
  isString,
}
